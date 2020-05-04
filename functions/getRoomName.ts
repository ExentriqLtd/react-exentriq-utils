/** @format */

import { TRoom, TSearch } from 'exentriq-utils';
import memoize from 'fast-memoize';

export const utilityGetRoomName = memoize(
  (item: TRoom | TSearch): string =>
    //@ts-ignore
    item.username || item.name || item.titleEml || item.title,
);
