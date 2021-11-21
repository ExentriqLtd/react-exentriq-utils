import React from 'react';
import { Text } from 'react-native-paper';

export const buildMessageGeneral = (message, styles)=>{
  let msgSplit = message.split(" ");
  let formattedText = [];
  msgSplit.forEach((word,index)=>{
      let mentionText = word;
      let isLastWord = index === msgSplit.length - 1;
      if (!word.startsWith('@')) { 
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