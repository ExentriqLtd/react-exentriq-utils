/** @format */
import memoize from 'fast-memoize';
import { TRoom } from './../declarations/rooms';

type Return = 'lock' | 'videocam' | 'library-books' | '';

export const utilityGetRoomIcon = memoize(
  (room: TRoom): Return => {
    if (room.ct) return 'videocam';
    if (room.t === 'p') return 'lock';
    if (!!room.cardId) return 'library-books';
    return '';
  },
);
