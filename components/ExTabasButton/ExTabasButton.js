import { Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExButton } from '../ExButton';
import { useTranslation } from 'react-i18next';

const ExTabasButton = ({ styles , listType}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.buttonContainer}>
      <Text
        style={[
          styles.singleButton,
          listType === 'everyone' && styles.singleButtonSelected,
        ]}
        // onPress={() => $setListType('everyone')}
        >
         {t('Everyone')}    
      </Text>
      <Text
        style={[
          styles.singleButton,
          listType === 'contacts' && styles.singleButtonSelected,
        ]}
        onPress={() => {
          if (!contactpermission) {
            Keyboard.dismiss();
          }
          $setListType('contacts');
        }}
        >
          {t('Contacts')} 
      </Text>
       <ExButton style={styles}
        colors={styles.gradient}
        text={t('Invite by Email')}
        onPress={() => {
           open({ name: 'inviteByEmail' });
        }}
        labelStyle={styles.singleButtonButtonLabel}
      /> 
    </View>
  );
}

export default ExTabasButton;
