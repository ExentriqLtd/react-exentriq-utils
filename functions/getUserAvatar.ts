/** @format */

import memoize from "fast-memoize";
import { EXENTRIQ_AVATAR_URL } from "../libs/config";

export const utilityGetUserAvatar = memoize(
  (username: string): string =>
    `${EXENTRIQ_AVATAR_URL}${username}`
);
