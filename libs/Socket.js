/** @format */
import { nanoid } from 'nanoid';
import { isFunction, last, get } from 'lodash';
import ReconnectingWebSocket from 'reconnecting-websocket';

// #region ::: DDP_CLIENT
export class ClientDDP {
  events = null;

  constructor() {
    this.events = {};
  }
  on = (event, listener) => {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  };
  removeListener = (event, listener) => {
    if (typeof this.events[event] === 'object') {
      const idx = this.events[event].indexOf(listener);
      if (idx > -1) {
        this.events[event].splice(idx, 1);
      }
    }
  };
  emit = (event, ...args) => {
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach(listener => {
        try {
          listener.apply(this, args);
        } catch (e) {
          console.log(e);
        }
      });
    }
  };
  once = (event, listener) => {
    this.on(event, function g(...args) {
      this.removeListener(event, g);
      listener.apply(this, args);
    });
  };

  destroy = () => {
    this.events = {};
  }
}
//#endregion

export class Socket extends ClientDDP {
  static instance = null;
  url = null;
  id = null;
  subscriptions = null;
  ddp = null;
  ws = null;

  constructor(url) {
    super();
    this.url = url.replace(/^https/, 'wss').replace(/^http/, 'ws');
    this.id = 0;
    this.subscriptions = {};
    this.connect();
    this.ddp = new ClientDDP();
    this.on('result', (data) =>
      this.ddp.emit(data.id, { result: data.result, error: data.error }),
    );
    this.on('ping', () => this.send({ msg: 'pong' }));
    this.on('ready', data => this.ddp.emit((data && data.subs && data.subs[0]) || data.collection, data));
    //this.on('removed', data => console.log('0..DDP.REMOVED', data) || this.ddp.emit((data && data.subs && data.subs[0]) || data.collection, data));
  }


  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
   static getInstance(url) {
      if (!Socket.instance && url) {
        Socket.instance = new Socket(url);
      }
      return Socket.instance;
  }

  send = (obj) => {
    return new Promise((resolve, reject) => {
      try {
        
        this.id += 1;
        const id = obj.id || `${this.id}`;
        this.ws.send(JSON.stringify({ ...obj, id }));
        if(!this.ddp && !this.ddp?.once) {
          return false;
        }
        this.ddp.once(id, data => {
          return data.error ? reject(data.error)  : resolve(data.result || data.subs);
        });
      } catch (e) {
        console.error('[EDO] call socket.js error:', {
          error: e,
          params: {...obj}
        })
        reject(new Error(e));
      }
    });
  };

  connect = () => {
    /* 
    type Options = {
        WebSocket?; // WebSocket constructor, if none provided, defaults to global WebSocket
        maxReconnectionDelay?: number; // max delay in ms between reconnections
        minReconnectionDelay?: number; // min delay in ms between reconnections
        reconnectionDelayGrowFactor?: number; // how fast the reconnection delay grows
        minUptime?: number; // min time in ms to consider connection as stable
        connectionTimeout?: number; // retry connect if not connected after this time, in ms
        maxRetries?: number; // maximum number of retries
        maxEnqueuedMessages?: number; // maximum number of messages to buffer until reconnection
        startClosed?: boolean; // start websocket in CLOSED state, call `.reconnect()` to connect
        debug?: boolean; // enables debug output
    };
    CONNECTING 0 The connection is not yet open.
    OPEN       1 The connection is open and ready to communicate.
    CLOSING    2 The connection is in the process of closing.
    CLOSED     3 The connection is closed or couldn't be opened.
    */
    const ws = new ReconnectingWebSocket(`${this.url}/websocket`, [], { debug: false });
    ws.addEventListener('open', () => {
      this.emit('open');
      
      ws.send(JSON.stringify({
        msg: 'connect',
        version: '1',
        support: ['1', 'pre2', 'pre1'],
      }));
    });

    ws.addEventListener('message', (e) => {
      const data = JSON.parse(get(e, 'data'));
      // console.log('socket:::WS..MESSAGE',data.msg, data);
      this.emit(data.msg, data);
      return data.collection && this.emit(data.collection, data);
    });

    ws.addEventListener('close', (e) => {
      // console.log('socket:::WS.CLOSE:TYPE:close', e);
      this.emit('disconnected', e)
    });
    ws.addEventListener('error', (e) => {
      // console.log('socket:::WS.CLOSE:TYPE:error', e);
      this.emit('disconnected', e)
    });

    //---EF-4-AUTH
    ws.removeEventListener = () => {
      ws.removeEventListener('open', () =>  { console.log('removeEventListener:::::open') });
      ws.removeEventListener('message', () => { console.log('removeEventListener:::::message') });
      ws.removeEventListener('close', (e) => this.emit('disconnected', e));
      ws.removeEventListener('error', (e) => this.emit('disconnected', e));
    }

    this.ws = ws;
  };

  logout = () => {
    return this.call('logout').then(() => {
      
      this.subscriptions = {};
      this.ddp?.destroy();
    });
  };

  disconnect = () => {
    this.emit('close');
    this.emit('disconnected_by_user');
    this.ws?.close(1020, 'ws.close: disconnect socket');
    this.logout();
  };


  
  call = (method, ...params) => {
    console.log('socket:::WS..CALL', method);
    return this.send({
      msg: 'method',
      method,
      params,
    }).catch((e) => {
      console.error('[EDO] Send:: error:::', {
        error: e,
        method
      })
    });
  };
  
  callAsync = (...args) => {
    // console.log('socket:::WS..CALLASYNC', args);
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

  
  subscribe = (name, ...params) => {
    console.log('socket:::WS..SUBSCRIBE', { name, ...params});
    const id = nanoid();
    
    this.subscriptions[id] = {};
    return new Promise((resolve) => {
      // console.log('2...send sub()=>::', {
      //   msg: 'sub',
      //   name,
      //   params,
      //   id,
      // });
      this.send({
        msg: 'sub',
        name,
        params,
        id,
      }).then((data) => {
        console.log('2...send sub then()=>::',data);
        let _id = data.id || id;
        
        this.subscriptions[_id] = {
          name,
          params
        };
        
        resolve(this.subscriptions[_id]);
      }).catch((e) => {
        console.error('[DDP.SUBSCRIBE.ERROR]', id, e);
        
        this.subscriptions[id] = {};
        resolve(undefined);
      });
    });
  };
}
