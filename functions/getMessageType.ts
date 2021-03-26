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

export const utilityIsVideoMessage = memoize(
  (message: TMessage): boolean =>
    !!message.attachments &&
    message.attachments.length > 0 &&
    !!message.attachments[0].video_url,
);

export const utilityIsFileMessage = memoize(
  (message: TMessage): boolean =>
    !!message.attachments &&
    message.attachments.length > 0 &&
    !message.attachments[0].video_url &&
    !message.attachments[0].image_url &&
    !!message.attachments[0].title_link,
);


export const utilityIsCardMessage = memoize(
  (message: TMessage): boolean => !!message.emlData?.cardId,
);
