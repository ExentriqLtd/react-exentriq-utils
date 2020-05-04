/** @format */

import { TMessage } from 'exentriq-utils';
import memoize from 'fast-memoize';

export const utilityIsImageMessage = memoize(
  (message: TMessage): boolean =>
    !!message.attachments &&
    message.attachments.length > 0 &&
    !!message.attachments[0].image_url,
);

export const utilityIsAudioMessage = memoize(
  (message: TMessage): boolean =>
    !!message.attachments &&
    message.attachments.length > 0 &&
    !!message.attachments[0].audio_url,
);

export const utilityIsCardMessage = memoize(
  (message: TMessage): boolean => !!message.emlData?.cardId,
);
