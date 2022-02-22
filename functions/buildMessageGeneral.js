import React from 'react';
import { Linking } from 'react-native';
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
            outputArr.push(text[i], separator.open, " ");
            outputArrString.push(text[i],separator.open, " ");
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



const handlerOpenUrl = (url) => {
  if(!url && url === '') return;
  Linking.canOpenURL(url.trim())
  .then(()=>{
    Linking.openURL(url.trim());
  }).catch();
}

export const buildMessageGeneralRender = ({ message, styles, active = true, provider = false }) => {
  let outputArr = [];
  let outputArrString = [];
  let i = 0;
  let text = message;
  let openUrl = false;
  let tmpUrl = '';
  let openSelected = false;
  let tmpMention = '';
  let separator = { open:'"', close:'"'};
  let re = new RegExp(regex.charactes);
  if (text){
    while (i < text.length) {
      let writeEmail = false;
      if (active){
        if (!openSelected && !openUrl){
          //normal
          if (text[i] !== '@' && text[i + 1] !== separator.open) {
              //here there are not with "push" because i want tracking for index
              outputArr[i] = text[i];
              outputArrString[i] = text[i];
          } 
          //email
          if (text[i] === '@' && text[i - 1] && re.test(text[i - 1])) {
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
        if(text[i - 2] === 'p' && text[i - 3] === 't'  && text[i - 4] === 't' && text[i - 5] === 'h'){
          openUrl = true;
          tmpUrl = text[i-5] + text[i-4] + text[i-3] + text[i-2] + text[i-1];
          console.log(outputArr[i],outputArr[i-1],outputArr[i-2],outputArr[i-3],outputArr[i-4]);
          outputArr.splice(i-5, 6);
        }
        if (openUrl) {
          tmpUrl = tmpUrl + text[i];
          if (text[i] ===  ' ' || text[i] ===  '\n') {
            openUrl = false;
            let urlHandler = tmpUrl;
            let url = (
              // eslint-disable-next-line no-loop-func
              <Text onPress={() => handlerOpenUrl(urlHandler)} key={i} style={styles.mentionText}>
                {tmpUrl}
              </Text>
            );
            outputArr.push(url);
            outputArrString.push(tmpUrl);
            tmpUrl = '';
          }
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