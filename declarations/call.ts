export interface TCall {
  _id: string;
  lastActive: {
    $date: number;
  };
  name: string;
  rid: string;
  started: {
    $date: number;
  };
  startedAt: {
    $date: number;
  };
  users:[]
}