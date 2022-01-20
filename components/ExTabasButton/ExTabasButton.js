import { Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

export const ExTabasButton = ({ ExButton, theme, styles, setListType, actionsheet }) => {
  const { t } = useTranslation();
  const { open } = useActionSheet();

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
        // onPress={() => {
        //   if (!contactpermission) {
        //     Keyboard.dismiss();
        //   }
        //   $setListType('contacts');
        // }}
        >
        {t('Contacts')}
      </Text>
      <ExButton
        colors={theme.colors.gradient}
        text={t('Invite by Email')}
        onPress={() => {
          open({ name: 'inviteByEmail' });
        }}
        labelStyle={styles.singleButtonButtonLabel}
      />
    </View>
  );
}
