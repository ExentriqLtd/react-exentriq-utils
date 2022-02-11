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
export const buildMessageGeneral = ({ message, styles, active = true, provider = false }) => {
  let outputArr = [];
  let outputArrString = [];
  let i = 0;
  let text = message;
  let openProgress = false;
  let tmpProgress = '';
  let openBudget = false;
  let tmpBudget = '';
  let openEffort = false;
  let tmpEffort = '';
  let openSelected = false;
  let tmpMention = '';
  let separator = { open:'"', close:'"'};
  let re = new RegExp(regex.charactes);
  if (text){
    while (i < text.length) {
      let writeEmail = false;
      if (active){
        if (!openSelected && !openEffort && !openBudget && !openProgress){
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
            outputArr.push(text[i], separator.open, " ");
            outputArrString.push(text[i],separator.open, " ");
          }
        }

        if (text[i] === '@' && text[i + 1] === separator.open) {
          openSelected = true;
        }
         //add for effort
         if(text[i] === '~'){
          openEffort = true;
        }

        //add for budget
        if(text[i] === '$'){
          openBudget = true;
        }

        //add for progress
        if(text[i] === '%'){
          openProgress = true;
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

        if (openEffort) {
          if(text[i] !== '~'){
            tmpEffort = tmpEffort + text[i];
          }
          if (text[i] === ' '){
            openEffort = false;
            let effort = (
              <Text key={i} style={styles.mentionText}>
                {tmpEffort}
              </Text>
            );
  
            outputArr.push(effort);
            outputArrString.push(tmpEffort);
            tmpEffort = '';
          }
        }

        if (openBudget) {
          if(text[i] !== '$'){
            tmpBudget = tmpBudget + text[i];
          }
          if (text[i] === ' '){
            openBudget = false;
            let budget = (
              <Text key={i} style={styles.mentionText}>
                {tmpBudget}
              </Text>
            );
  
            outputArr.push(budget);
            outputArrString.push(tmpBudget);
            tmpBudget = '';
          }
        }

        if (openProgress) {
          if(text[i] !== '%'){
            tmpProgress = tmpProgress + text[i];
          }
          if (text[i] === ' '){
            openProgress = false;
            let progress = (
              <Text key={i} style={styles.mentionText}>
                {tmpProgress}
              </Text>
            );
  
            outputArr.push(progress);
            outputArrString.push(tmpProgress);
            tmpProgress = '';
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