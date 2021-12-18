import React from 'react';
import { Text } from 'react-native-paper';

export const buildMessageGeneral = ({message, styles, active = true})=>{
  let formattedText = [];
 
  if (message === undefined || message === null) 
  return formattedText;

  let msgSplit = message.split(" ");
  msgSplit.forEach((word,index)=>{
      let mentionText = word;
      let isLastWord = index === msgSplit.length - 1;
      if (!word.startsWith('@') || !active) { 
        return isLastWord ? formattedText.push(word) : formattedText.push(word, ' ');
      }
      const mention = (
        <Text 
        key={word + index} 
        style={styles.mentionText}>
          {mentionText}
        </Text>
      );
       isLastWord ? formattedText.push(mention) : formattedText.push(mention, ' ');
  });
  return formattedText;
}