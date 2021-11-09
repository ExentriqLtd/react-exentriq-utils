/** @format */

import { TCall } from "../declarations/calls";
import memoize from "fast-memoize";

const getDateCalls = (field: TCall): number => {
  const lastActive = Object.prototype.hasOwnProperty.call(field, 'lastActive');
  const startedAt = Object.prototype.hasOwnProperty.call(field, 'startedAt');
  const started = Object.prototype.hasOwnProperty.call(field, 'started');

  if (startedAt) return field.startedAt.$date;
  if (started) return field.started.$date;
  if (lastActive) return field.lastActive.$date;
  return 0;
};

export const utilityOrderCallsByDate = memoize((calls: TCall[]): TCall[] =>
  calls.slice().sort((a: TCall, b: TCall): number => getDateCalls(b) - getDateCalls(a)),
);