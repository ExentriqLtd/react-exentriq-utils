import React from 'react';
import { Text } from 'react-native-paper';
const regex = {
  charactes:/[\S]+/g
};
/**
 * split with custom logic
 * @param message
 * @param styles
 * @param active
 * @returns
 */
export const buildMessageGeneral = ({ message, styles, active = true }) => {
  let outputArr = [];
  let outputArrString = [];
  let i = 0;
  let text = message;
  let openSelected = false;
  let tmpMention = '';
  let separator = { open:'"', close:'"'};
  let re = new RegExp(regex.charactes);
  if (text){
    while (i < text.length) {
      let writeEmail = false;
      if (active){
        if (!openSelected){
          //normal
          if (text[i] !== '@' && text[i + 1] !== separator.open) {
            outputArr.push(text[i]);
            outputArrString.push(text[i]);
          } //email
          else if (text[i] === '@' && text[i - 1] && re.test(text[i - 1])) {
            outputArr.push(text[i]);
            outputArrString.push(text[i]);
            writeEmail = true;
          }
          //add for open search
          if (!writeEmail && text[i] === '@' && text[i + 1] !== separator.open){
            outputArr.push(text[i], separator.open);
            outputArrString.push(text[i],separator.open);
          }
        }
        if (text[i] === '@' && text[i + 1] === separator.open) {
          openSelected = true;
        }
        if (openSelected) {
          tmpMention = tmpMention + text[i];
          if (text[i] ===  separator.close && text[i - 1] !== '@') {
            openSelected = false;
            // const mention = '@“(<Text key={i} style={styles.mentionText}>'+tmpMention+'</Text>“';
            let mention = (
              <Text key={i} style={styles.mentionText}>
                {tmpMention}
              </Text>
            );
            outputArr.push(mention);
            outputArrString.push(tmpMention);
            tmpMention = '';
          }
        }
      } else {
        outputArr.push(text[i]);
        outputArrString.push(text[i]);
      }
      i++;
    }
  }
  return {
    outputArr,
    outputArrString,
  };
};
