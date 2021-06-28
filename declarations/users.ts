export interface TStatusValues {
  online: string;
  away: string;
  busy: string;
  offline: string;
}

export type TStatus = keyof TStatusValues;

export const mapStatusColor: TStatusValues = {
  online: "#4caf50",
  away: "#ffc107",
  busy: "#f3565d",
  offline: "#9e9e9e",
};

export interface TUser {
  id?: string;
  _id: string;
  name: string;
  username: string;
  original_name?: string;
  euid?: string;
}

interface TMeta {
  map?: {
    roomId?: string;
  }
}
export interface TSearch {
  lastNameFirstName_analyzed: string;
  lastName: string;
  email_analyzed: string;
  hidden: boolean;
  original_title: string;
  collectionName: string;
  companyName: string;
  archived: boolean;
  _type: "User" | "Subscription" | "Entity";
  lastNameFirstName: string;
  title: string;
  firstName: string;
  firstNameLastName_analyzed: string;
  title_analyzed: string;
  _id: string;
  firstNameLastName: string;
  email: string;
  sort: number;
  id: string;
  name: string;
  type: string;
  __originalId: string;
  t: "c" | "d" | "p" | "l";
  cardId?: string;
  createdAtTime?: number;
  updatedAt: Date;
  rid?: string; // GROUP
  username?: string;
  meta?: TMeta;
  msg?: string;
  roomName?: string;
  ts?: {
    $date?: number;
  } | number | string;
  euid?: string;
}
