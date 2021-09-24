import { TMessage } from 'exentriq-utils';
import { TStatus } from "./users";

export interface TRoom {
  isNew?: boolean;
  _id: string;
  open: boolean;
  alert: false;
  unread: number;
  status?: TStatus;
  ts: {
    $date: number;
  };
  rid: string;
  name: string;
  t: "c" | "d" | "p" | "l";
  desktopNotifications: string;
  mobileNotifications: string;
  cardId?: string;
  path?: string;
  u: {
    _id: string;
    username: string;
  };
  ls: {
    $date: number;
  };
  exCreatedAt: {
    $date: number;
  };
  exUpdatedAt: {
    $date: number;
  };
  _sort: {
    name: string;
    auser: {
      name: string;
    };
  };
  roles: string[];
  tlv: {
    $date: number;
  };
  lm: {
    $date: number;
  };
  ct: string; // TYPES
  tc: {
    $date: number;
  };
  username: string;
  lastMessage?: TMessage;
  message?:TMessage;
  tId?: string;
  language?: string;
  mention?: string;
}

export interface TRoomType {
  isCard?: boolean;
  isGroup?: boolean;
  isCall?: boolean;
  isDirect?: boolean;
}

export interface TMention {}
