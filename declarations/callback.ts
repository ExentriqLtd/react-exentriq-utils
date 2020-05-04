import { TReceived, TMessage } from "./messages";

export interface TCallbackMessageReceived {
  rid: string;
  msg: string;
  ts: {
    $date: number;
  };
  u: {
    _id: string;
    username: string;
  };
  _id: string;
  received: TReceived[];
}

export interface TCallbackMessageRead {
  uid: string;
  messages: TMessage[];
  rid: string;
  date: number;
}

export interface TCallbackMessageDeleted {
  _id: string;
  rid: string;
  date: number;
}

export interface TCallbackUserIsTyping {
  username: string;
  isTyping: boolean;
}
