interface TUsers {
  _id: string;
  name?: string;
  username?: string;
}

export interface TCall {
  _id: string;
  unread?: number;
  rid: string;
  name: string;
  t?: "c" | "d" | "p" | "l";
  lastActive: {
    $date: number;
  };
  started: {
    $date: number;
  };
  username?: string;
  startedAt: {
    $date: number;
  }
  users?: TUsers[];
}
