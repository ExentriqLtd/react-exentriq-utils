import { Text } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ExButton } from '../ExButton';


const ExTabsButton = ({ styles , onSetExTabsState , exTabsState }) => {
    const { t } = useTranslation(); 
  
    console.log("ExTabsButton:::exTabsState",exTabsState)

    
    return (
      <View style={styles.buttonContainer}>
      <Text
        style={[
          styles.singleButton,
          exTabsState.listType === 'everyone' && styles.singleButtonSelected,
        ]}
        onPress= {() => {
        onSetExTabsState({ field: 'listType', value: "everyone" })}}>
          
        {t('Everyone')}
      </Text>
      <Text
        style={[
          styles.singleButton,
          exTabsState.listType === 'contacts' && styles.singleButtonSelected,
        ]}
        onPress={() => { 
          // if (!exTabsState.contactpermission) {
          //   Keyboard.dismiss();
          // }
          console.log("ExTabsButton:::exTabsState",exTabsState)
          onSetExTabsState({ field: 'listType', value: "contacts" })
        }}>
        {t('Contacts')}
      </Text>
      <ExButton
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

export default ExTabsButton;
