/** @format */

import { TRoom } from 'exentriq-utils';
import memoize from 'fast-memoize';

type Return = 'lock' | 'videocam' | 'library-books' | '';

export const utilityGetRoomIcon = memoize(
  (room: TRoom): Return => {
    if (room.ct) return 'videocam';
    if (room.t === 'p') return 'lock';
    if (!!room.cardId) return 'library-books';
    return '';
  },
);
