/** @format */
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  mentionText: {
    color: '#F04692',
    fontWeight: 'bold'
  }
});

export const buildMessageGeneral = (message)=>{
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
        formattedText.push(mention, ' ');
    });
    return formattedText;
  }
