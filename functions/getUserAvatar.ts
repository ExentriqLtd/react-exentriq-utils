/** @format */

import memoize from "fast-memoize";
import { EXENTRIQ_AVATAR_URL, EXENTRIQ_GROUPAVATAR_URL } from "../libs/config";

export const utilityGetUserAvatar = memoize(
  (username: string): string =>
    `${EXENTRIQ_AVATAR_URL}${username}`
);

export const utilityGetGroupAvatar = memoize(
  (rid: string): string =>
    `${EXENTRIQ_GROUPAVATAR_URL}${rid}`
);