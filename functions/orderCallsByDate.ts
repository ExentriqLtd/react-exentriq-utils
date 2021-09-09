/** @format */

import { TCalls } from "../declarations/calls";
import memoize from "fast-memoize";

interface TDate {
  $date: number;
}

const getDateCalls = (field: TCalls): number => {
  const started = Object.prototype.hasOwnProperty.call(field, 'started');
  if (started) return field.started.$date;
  return 0;
};

export const utilityOrderCallsByDate = memoize((calls: TCalls[]): TCalls[] =>
  calls.slice().sort((a: TCalls, b: TCalls): number => getDateCalls(b) - getDateCalls(a)),
);