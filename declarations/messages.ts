// #region ::: PARTIALS
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

export interface TGeoLocation {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

interface TAttachment {
  title?: string;
  title_link?: string;
  title_link_download?: boolean;
  type?: string;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  image_type?: string;
  image_size?: number;
  image_dimensions?: {
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
  geoLocation: TGeoLocation;
  geoCode:[]
  u: {
    _id: string;
    username: string;
    name: string;
  };
  grupable?: boolean;
  received?: TReceived[];
  read?: TRead[];
  // @FIXME: Is it used ?
  file?: {
    _id: string;
    name: string;
  };
  meetRoomId?: string;
  lastMessage?: any;
  lastMessages?: any;
  for?: string;
  message?:TMessage;
  reply?:boolean;
  forwarded?:boolean;
  translations?: any;
  meetMessage?: string;
  tId: string;
  onSending?: boolean;
  messageId?: string;
  abort?: boolean;
  progress?: number;
  uploaded?: boolean;
}