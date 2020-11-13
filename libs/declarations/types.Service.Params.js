/* eslint-disable flowtype/no-types-missing-file-annotation */
/** @format */

export interface TParamsGoogleLogin {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    gender: string;
    pictureUrl: string;
    email: string;
    token: string;
    app: String;
}

export interface TParamsLogin {
  username: string;
  password: string;
}

export interface TParamsSignup {
  username: string;
  email: string;
  password: string;
}

export interface TParamsSendMessage {
  rid: string;
  msg: string;
}

export interface TParamsStarMessage {
  messageID: string;
  starred: boolean;
}

export interface TParamsCreatePrivateGroup {
  groupName: string;
  memberList: string[];
}

export interface TParamsSubscribeRoom {
  rid: string;
  callbackMessageDeleted: (event: any) => void;
  callbackMessageReceived: (event: any) => void;
  callbackUserMessageRead: (event: any) => void;
  callbackUserReceivedMessage: (event: any) => void;
  callbackUserIsTyping: (event: any) => void;
  callbackInvitedInserted: (event: any) => void;
  callbackInvitedUpdated: (event: any) => void;
  callbackInvitedRemoved: (event: any) => void;
}

export interface TParamsUnsubscribeRoom {
  rid: string;
  callbackUnsubscribeRoom: (data: any) => void;
}

export interface TParamsConnect {
  url: String;
  callbackOnConnected: () => void;
  callbackOnDisconnected: () => void;
  callbackOnDisconnectedByUser: () => void;
  callbackOnReconnect: () => void;
  callbackOnOpenConnection: () => void;
}

export interface TParamsUploadFile {
  file: any;
  rid: string;
}
