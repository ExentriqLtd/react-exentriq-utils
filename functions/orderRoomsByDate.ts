/** @format */

import { TRoom } from "../declarations/rooms";
import memoize from "fast-memoize";

interface TDate {
  $date: number;
}

const getDate = (field: TRoom): number => {
  const exUpdatedAt = Object.prototype.hasOwnProperty.call(field, 'exUpdatedAt');
  const lm = Object.prototype.hasOwnProperty.call(field, 'lm');
  const tlv = Object.prototype.hasOwnProperty.call(field, 'tlv');
  const ls = Object.prototype.hasOwnProperty.call(field, 'ls');
  const ts = Object.prototype.hasOwnProperty.call(field, 'ts');
  if (lm) return field.lm.$date;
  if (exUpdatedAt) return field.exUpdatedAt.$date;
  if (ls) return field.ts.$date;
  if (tlv) return field.tlv.$date;
  return field.ts.$date;
};

export const utilityOrderRoomsByDate = memoize((rooms: TRoom[]): TRoom[] =>
  rooms.slice().sort((a: TRoom, b: TRoom): number => getDate(b) - getDate(a)),
);