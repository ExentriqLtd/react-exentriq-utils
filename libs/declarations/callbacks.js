/** @format */
export interface TReceived {
    _id: string;
    ts: {
      $date: number;
    };
  }

  interface TRead {
    _id: string;
    ts: {
      $date: number;
    };
  }

  interface TAttachment {
    title: string;
    title_link: string;
    title_link_download: boolean;
    type: string;
    image_url: string;
    audio_url: string;
    image_type: string;
    image_size: number;
    image_dimensions: {
      width: number;
      height: number;
    };
  }
  // #endregion

  export interface TMessage {
    loading?: boolean;
    _id: string;
    t?: string;
    rid: string;
    ts: {
      _id?: string;
      $date: number;
    };
    msg: string;
    msgInner?: string;
    emlData?: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
      entities: [];
      cardId?: string;
    };
    attachments: TAttachment[];
    u: {
      _id: string;
      username: string;
    };
    grupable?: boolean;
    received?: TReceived[];
    read?: TRead[];
    // @FIXME: Is it used ?
    file?: {
      _id: string;
      name: string;
    };
  }


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
