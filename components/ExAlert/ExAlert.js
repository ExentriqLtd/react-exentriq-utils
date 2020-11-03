import React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

export default function ExAlert({ show, title, msg, onDismiss }) {
  return (
    <View>
      <Portal>
        <Dialog visible={show} dismissable={false}>
          {title && <Dialog.Title>{title}</Dialog.Title>}
          <Dialog.Content>
            <Paragraph>{msg}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button dark onPress={() => onDismiss()}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}