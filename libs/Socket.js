/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/** @format */

// #region ::: DDP_CLIENT
import { last, isFunction } from 'lodash';
export class ClientDDP {
  events = null;

  constructor() {
    this.events = {};
  }

  on = (event, listener): void => {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  };

  removeListener = (event, listener): void => {
    if (typeof this.events[event] === 'object') {
      const idx = this.events[event].indexOf(listener);

      if (idx > -1) {
        this.events[event].splice(idx, 1);
      }
    }
  };

  emit = (event, ...args): void => {
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach((listener) => {
        try {
          listener.apply(this, args);
        } catch (e) {
          console.log(e);
        }
      });
    }
  };

  once = (event, listener): void => {
    this.on(event, function g(...args) {
      this.removeListener(event, g);

      listener.apply(this, args);
    });
  };
}

// #endregion

export class Socket extends ClientDDP {
  url = null;
  id = null;
  subscriptions = null;
  ddp = null;
  connection = null;

  constructor(url: string) {
    super();
    this.url = url.replace(/^https/, 'wss').replace(/^http/, 'ws');
    this.id = 0;
    this.subscriptions = {};
    this.connect();

    this.ddp = new ClientDDP();
    this.on('result', (data: any) =>
      this.ddp.emit(data.id, { result: data.result, error: data.error }),
    );
    this.on('ping', () => this.send({ msg: 'pong' }));

    this.on('ready', (data) => this.ddp.emit(data.subs[0], data));
  }

  send = (obj: any): any =>
    new Promise((resolve, reject) => {
      this.id += 1;
      const id = obj.id || `${this.id}`;

      this.connection.send(JSON.stringify({ ...obj, id }));

      this.ddp.once(id, (data) =>
        data.error ? reject(data.error) : resolve(data.result || data.subs),
      );
    });

  connect = (): void => {
    const connection = new WebSocket(`${this.url}/websocket`);

    connection.onopen = (): void => {
      this.emit('open');
      this.send({
        msg: 'connect',
        version: '1',
        support: ['1', 'pre2', 'pre1'],
      });
    };

    connection.onclose = (e): any => this.emit('disconnected', e);

    connection.onmessage = (e): void => {
      const data = JSON.parse(e.data);
      this.emit(data.msg, data);

      return data.collection && this.emit(data.collection, data);
    };

    this.connection = connection;
  };

  logout = (): void =>
    this.call('logout').then(() => {
      this.subscriptions = {};
    });

  disconnect = (): void => {
    this.emit('disconnected_by_user');

    this.connection.close();
  };

  reconnect = (): void => {
    this.disconnect();
    this.once('connected', () => {
      Object.keys(this.subscriptions).forEach((key) => {
        const { name, params } = this.subscriptions[key];

        this.subscriptions[key].unsubscribe();
        this.subscribe(name, params);
      });
    });
    this.connect();
  };

  call = (method, ...params): any =>
    this.send({
      msg: 'method',
      method,
      params,
    });

  callAsync = (...args) => {
    let fn = last(args);
    const newArgs = args;
    if (!fn || !isFunction(fn)) {
      fn = () => {};
    } else {
      newArgs.pop();
    }
    return this.call(...newArgs)
      .then((result) => {
        fn(null, result);
      })
      .catch((e) => {
        fn(e);
      });
  };

  unsubscribe = (key: any): any => {
    if (!this.subscriptions[key]) {
      return Promise.reject();
    }

    delete this.subscriptions[key];

    return this.send({
      msg: 'unsub',
      id: key,
    });
  };

  subscribe = (name, ...params): any =>
    this.send({
      msg: 'sub',
      name,
      params,
      id: params[0],
    }).then((data: any) => {
      let id = data.id;

      if (!id) {
        id = params[0];
      }

      this.subscriptions[id] = {
        name,
        params,
        unsubscribe: (): void => this.unsubscribe(id),
      };

      return this.subscriptions[id];
    });
}
