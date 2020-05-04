/** @format */

import { TStatus, mapStatusColor } from "../declarations/users";
import memoize from "fast-memoize";

export const utilityGetStatusColor = memoize(
  (status: TStatus): string => mapStatusColor[status]
);
