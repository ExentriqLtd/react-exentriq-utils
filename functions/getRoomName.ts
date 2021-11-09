/** @format */
import memoize from 'fast-memoize';
import { TSearch } from './../declarations/users';
import { TRoom } from './../declarations/rooms';


export const utilityGetRoomName = memoize(
  (item: TRoom | TSearch): string =>
    //@ts-ignore
    item.username || item.name || item.titleEml || item.title,
);
