import React from 'react';
import { Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { isObject } from 'lodash';

const regex = {
  charactes:/[\S]+/g,
  link: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  mention: /@".*?"/g,
  emoji: /([\uD800-\uDBFF][\uDC00-\uDFFF])/,
  unrecognized: /\uFFFD/g,
  splitCustom: /([\uD800-\uDBFF][\uDC00-\uDFFF])|(@".*?")/g,
};
const emojiSplit = function (str) {
  if (typeof str === 'string') {
    const split = str.split(regex.emoji).join('');
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

const emojiStringToArray = function (str) {
  const split = str.split(regex.splitCustom);
  let arr = [];
   for (var i=0; i<split.length; i++) {
     let char = split[i]
     if (char !== "") {
       arr.push(char);
     }
   }
   return arr;
};

/**
 * This is a function for render content message 
 * @param {*} param0 
 * @returns 
 */
 export const buildMessageGeneralRender = ({ message, styles, active = true }) => {
  let outputArr:any = [];
  let outputArrString:any = [];
  outputArr = emojiStringToArray(message);
  const matchLink = message.match(regex.link);
  //links
  const regexLink = new RegExp(regex.link);
  outputArr.forEach((element, idx) => {
    const isLink = regexLink.test(element);
    if (isLink) {
      element.replace(matchLink)
      let newElement = element;
      matchLink && matchLink.forEach(link => {
        const linkComponents = '___'+link+'___';
        newElement = newElement.replaceAll(link, linkComponents)
        outputArr[idx] = newElement;
      });
    } else { 
      outputArr[idx] = element;
    }
  });
  let splitLinks = outputArr.join(' ').split('___');
  let isLinks = false;
  splitLinks.forEach((element, idx) => {
    const isLink = regexLink.test(element);
    if (isLink) {
      isLinks = true;
      const linkComponents = <Text onPress={() => handlerOpenUrl(element)} key={idx} style={styles.text}>{element}</Text>;
      splitLinks[idx] = linkComponents;
    }
  });
  if(isLinks){
    outputArr = splitLinks;
  }

  //mentions
  const regexMention = new RegExp(regex.mention);
  outputArr.forEach((element, idx) => {
    let newElements:any = element;
    if (!isObject(element)){
      const matchMentions = element.toString().match(regex.mention);
      newElements = emojiStringToArray(element);
      newElements.forEach((newEl, idxNewEl) => {
        matchMentions && matchMentions.forEach((mention, idx) =>{
          if (newEl && newEl.replace) {
            newEl = newEl.replace(mention, '---'+mention+'---');
            let splitMentions = newEl.split('---');
            splitMentions.forEach((splitMention, idxSplitMention) => {
              const mentionComponent = (
                <Text style={styles.text}>
                  {mention}
                </Text>
              );
                const isMention = regexMention.test(splitMention);
                if (isMention) {
                  splitMentions[idxSplitMention] = mentionComponent;
                }
            });
            newEl = splitMentions;
            newElements[idxNewEl] = newEl;
          }
        });
      });
    }
    outputArr[idx] = newElements;
  });
 return {
   outputArr,
   outputArrString,
 };
};