import React from 'react';
import { Text } from 'react-native-paper';

/**
 * split with custom logic
 * @param message
 * @param styles
 * @param active
 * @returns
 */
export const buildMessageGeneral = ({ message, styles, active = true, useSeparatorFixCursive = true }) => {
  let outputArr = [];
  let outputArrString = [];
  let i = 0;
  let text = message;
  let openSelected = false;
  let tmpMention = '';
  let separator = { open:'"', close:'"'};
  if (useSeparatorFixCursive) {
  }
  if (text){
    while (i < text.length) {
       //open search
       if (!openSelected && text[i] === '@' && !text[i + 1] && text[i + 1] !== separator.open){
        outputArr.push(text[i], separator.open);
        outputArrString.push(text[i],separator.open);
      }

      //normal
      if (!openSelected && text[i] !== '@' && text[i + 1] !== separator.open) {
        outputArr.push(text[i]);
        outputArrString.push(text[i]);
      }

      if (openSelected) {
        tmpMention = tmpMention + text[i];
        if (text[i] ===  separator.close && text[i - 1] !== '@') {
          openSelected = false;
          // const mention = '@“(<Text key={i} style={styles.mentionText}>'+tmpMention+'</Text>“';
          let mention = (
            <Text key={i} style={styles.mentionText}>
              {'@' + tmpMention}
            </Text>
          );
          if (!active){
            mention = tmpMention;
          }
          outputArr.push(mention);
          outputArrString.push('@' + tmpMention);
          tmpMention = '';
        }
      }
      if (text[i] === '@' && text[i + 1] === separator.open) {
        openSelected = true;
      }
      i++;
    }
  }
  return {
    outputArr,
    outputArrString,
  };
};
