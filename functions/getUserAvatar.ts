/** @format */

import memoize from "fast-memoize";
import { APP_NAME } from "../constants/config";
import { EXENTRIQ_AVATAR_URL, EXENTRIQ_GROUPAVATAR_URL } from "../libs/config";

export const utilityGetUserAvatar = memoize(
  (username: string): string =>
    `${EXENTRIQ_AVATAR_URL}${username}`
);

export const utilityGetGroupAvatar = memoize(
  (rid: string, typeOfRoom: any, updated = false): string =>
    `${EXENTRIQ_GROUPAVATAR_URL}${rid}&app=${APP_NAME}&groupType=${typeOfRoom}${updated ? `&timestamp=${new Date().getTime()}` : ''}`,
);