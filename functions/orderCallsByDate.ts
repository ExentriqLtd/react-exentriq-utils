/** @format */

import { TRoom } from "../declarations/rooms";
import memoize from "fast-memoize";

const getDateCalls = (field: TRoom): number => {
  const exUpdatedAt = Object.prototype.hasOwnProperty.call(field, 'exUpdatedAt');
  const lm = Object.prototype.hasOwnProperty.call(field, 'lm');
  const tlv = Object.prototype.hasOwnProperty.call(field, 'tlv');
  const ls = Object.prototype.hasOwnProperty.call(field, 'ls');
  const ts = Object.prototype.hasOwnProperty.call(field, 'ts');
  if (lm) return field.lm.$date;
  if (tlv) return field.tlv.$date;
  if (ls) return field.ts.$date;
  if (ts) return field.ts.$date;
  if (exUpdatedAt) return field.exUpdatedAt.$date;
  return 0;
};

export const utilityOrderCallsByDate = memoize((calls: TRoom[]): TRoom[] =>
  calls.slice().sort((a: TRoom, b: TRoom): number => getDateCalls(b) - getDateCalls(a)),
);