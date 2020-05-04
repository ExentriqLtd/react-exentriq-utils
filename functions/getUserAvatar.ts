/** @format */

import memoize from "fast-memoize";

export const utilityGetUserAvatar = memoize(
  (username: string): string =>
    `https://stage.exentriq.com/AvatarService?username=${username}`
);
