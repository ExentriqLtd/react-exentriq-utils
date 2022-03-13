import React from 'react';
import { Linking } from 'react-native';
import { Text } from 'react-native-paper';
const regex = {
  charactes:/[\S]+/g,
  link: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  mention: /@".*?"/g,
  emoji: /([\uD800-\uDBFF][\uDC00-\uDFFF])/,
  unrecognized: /\uFFFD/g
};

const emojiSplit = function (str) {
  if (typeof str === 'string') {
    const split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/).join('');
    return split;
  }
};

const removeNonUtf8 = (characters) => {
  try {
      // ignore invalid char ranges
      var bytelike = unescape(encodeURIComponent(characters));
      characters = decodeURIComponent(escape(bytelike));
  } catch (error) { }
  // remove �
  characters = characters.replace(/[\u{0080}-\u{FFFF}]/gu, '');
  return characters;
}
/**
 * This is a function for build message when write input
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
    let separator = { open: '"', close: '"' };
    let re = new RegExp(regex.charactes);
    let reEmoji = new RegExp(regex.emoji);
    let unrecognized = new RegExp(regex.unrecognized);

    if (text) {
      while (i < text.length) {
        const isEmoj = reEmoji.test(text[i]+text[i+1]);
        const isUnrecognized = unrecognized.test(text[i]);
        let writeEmail = false;
        if (active) {
          if (!openSelected) {
            //normal
            if (text[i] !== '@' && text[i + 1] !== separator.open) {
              if (isEmoj){
                const emoji = emojiSplit(text[i]+text[i + 1]);
                outputArr.push(emoji);
                outputArrString.push(emoji);
              } else if (!isUnrecognized){
                removeNonUtf8(text[i]);
                outputArr.push(removeNonUtf8(text[i]));
                outputArrString.push(removeNonUtf8(text[i]));
              }
            } //email
            else if (text[i] === '@' && text[i - 1] && re.test(text[i - 1])) {
              outputArr.push(text[i]);
              outputArrString.push(text[i]);
              writeEmail = true;
            }
            //add for open search
            if (!writeEmail && text[i] === '@' && text[i + 1] !== separator.open) {
              outputArr.push(text[i], separator.open, " ");
              outputArrString.push(text[i], separator.open, " ");
            }
          }
        if (text[i] === '@' && text[i + 1] === separator.open) {
          openSelected = true;
        }
        if (openSelected) {
          tmpMention = tmpMention + text[i];
          if (text[i] ===  separator.close && text[i - 1] !== '@') {
            openSelected = false;
            let mention = (
              <Text key={i} style={styles.text}>
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
  }).catch((e)=>{
    console.warn('cannot open url error:', e);
  });
}

/**
 * This is a function for render content message 
 * @param {*} param0 
 * @returns 
 */
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
          outputArr.splice(i-5, 6);
        }
        if (openUrl) {
          tmpUrl = tmpUrl + text[i];
          if (text[i] ===  ' ' || text[i] ===  '\n' || text.length === i+1) {
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