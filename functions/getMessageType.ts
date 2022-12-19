/** @format */
import memoize from 'fast-memoize';
import { TMessage } from './../declarations/messages';

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

export const utilityIsGroupServiceMessage = memoize(
  (message: TMessage): boolean => {
    const { t } = message || {};
    if (!t) return false;
    return ['au', 'ru', 'r', 'ul', 'uj', 'wm','rm','rtc','user-muted','user-unmuted','subscription-role-added','subscription-role-removed'].indexOf(t) >=0;
  }
);

export const utilityIsTranslationAvailable = memoize(
  (translations: any, langAlreadySelected: string): boolean => {
    if(translations[langAlreadySelected]) {
      return true;
    }
    return false;
  }
);

export const utilityIsInvitedMessage = memoize(
  (message: TMessage): boolean => {
    const { t, for: fieldFor } = message || {};
    if (t === 'meet' && !!fieldFor) {
      return true;
    }
    return false;
  }
);