/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/** @format */

interface TParamsSubscribe {
  key: string;
  userId: string | null;
  callback: (data: any) => void;
}

export class Streamer {
  ddp = null;
  event = null;
  handlers = null;
  destroyCallbacks = null;
  subscriptions = null;
  useUserId = null;

  // @ts-ignore
  constructor(ddp, event = 'stream-exentriq-user-stream', useUserId = true) {
      this.ddp = ddp;

      // @ts-ignore
      this.event = event;

      // @ts-ignore
      this.handlers = {};

      // @ts-ignore
      this.ddp.on(event, this._handleEvent);

      // @ts-ignore
      this.destroyCallbacks = {};

      // @ts-ignore
      this.subscriptions = {};

      // @ts-ignore
      this.useUserId = useUserId;
  }

  getOnDestroy = (event: any) => (cb: any): void => {
      // @ts-ignore
      this.destroyCallbacks[event] = cb;
  };

  _handleEvent = (ddpMessage: any): void => {
      const event = ddpMessage.fields.eventName;

      // @ts-ignore

      if (this.handlers[event]) {
          this.handlers[event](...ddpMessage.fields.args);
        } else {
          throw new Error(`[STREAMER] EVENT ${event} NOT FOUND`);
      }
  };

  subscribe = ({ key, userId = null, callback }: TParamsSubscribe): any => {
      const event = this.useUserId ? `${userId}/${key}` : key;

      // @ts-ignore

      this.handlers[event] = callback;

      // @ts-ignore
      this.subscriptions[event] = this.ddp.subscribe(this.event, event, false);

      return { onDestroy: this.getOnDestroy(event) };
  };

  // @ts-ignore
  unsubscribe = ({ key, userId = null }): void => {
      const event = this.useUserId ? `${userId}/${key}` : key;

      if (Object.prototype.hasOwnProperty.call(this.subscriptions, event))

      // @ts-ignore
      {
          this.ddp.unsubscribe(event);
      }

      // @ts-ignore
      const onDestroyCallback = this.destroyCallbacks[event];

      if (onDestroyCallback) {
          onDestroyCallback();
      }
  };

  destroy = (): void => {
      // @ts-ignore
      const keys = Object.keys(this.subscriptions);

      for (let i = 0; i < keys.length; i += 1) {
      // @ts-ignore
          this.ddp.unsubscribe(this.subscriptions[keys[i]]);
      }
  };
}
