/** @format */

import { TRoom } from "../declarations/rooms";
import memoize from "fast-memoize";

export const utilityOrderRoomsByDate = memoize((rooms: TRoom[]): TRoom[] =>
  rooms.slice().sort((a: TRoom, b: TRoom): number => b.lm.$date - a.lm.$date)
);
