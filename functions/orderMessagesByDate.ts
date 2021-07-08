/** @format */

import { TMessage } from "../declarations/messages";
import memoize from "fast-memoize";

export const utilityOrderMessagesByDate = memoize(
  (messages: TMessage[] | false): TMessage[] | false => {
    if (!messages) return false;
    const orderedMessages = messages.filter((m) => {
      return !!m._id;
    })
      .slice()
      .sort((a: TMessage, b: TMessage): number => b.ts.$date - a.ts.$date);

    return orderedMessages;
  }
);
