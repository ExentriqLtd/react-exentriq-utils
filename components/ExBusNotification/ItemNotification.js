/** @format */

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EXENTRIQ_AVATAR_URL } from 'exentriq-utils/libs/config';
import { utilityFormatDate } from 'exentriq-utils//functions/formatDate';

function ItemNotification(props) {
  const { t } = useTranslation();
  const { item, onRemove, onOpen, ExIconButton, dindleTheme } = props;
  const { from_user, subject, notified, timestamp, id } = item || {};
  const lastUpdated = timestamp ? utilityFormatDate(timestamp) : '';

  const styles = StyleSheet.create({
    avatarView: {
      position: 'relative',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 4,
      paddingBottom: 4,
    },
    containerGeneral: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderBottomColor: dindleTheme.colors.lightGrey,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.2,
      alignItems: 'flex-start',
      backgroundColor: notified
        ? dindleTheme.backgroundColor
        : dindleTheme.colors.grey300,
    },
    container: {
      flexDirection: 'row',
      flex: 1,
      paddingVertical: 4,
    },
    avatarContainer: {
      paddingRight: 4,
    },
    textContainer: {
      flex: 1,
    },
    closeContainer: {},
    avatar: {
      height: 60,
      width: 60,
      resizeMode: 'contain',
      borderRadius: 30,
    },
    userTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: dindleTheme.colors.text,
    },
    subject: {
      fontSize: 14,
      paddingTop: 4,
      color: dindleTheme.colors.text,
    },
    lastUpdated: {
      fontSize: 12,
      paddingTop: 4,
      color: dindleTheme.colors.text,
    },
    open: {
      fontSize: 14,
      textDecorationLine: 'underline',
      color: dindleTheme.primary,
    },
  });
  return (
    <View style={styles.containerGeneral}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: `${EXENTRIQ_AVATAR_URL}${from_user}` }}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.userTitle} numberOfLines={1}>
            {from_user}
          </Text>
          <Text style={styles.subject} numberOfLines={3}>
            {subject}
          </Text>
          <Text style={styles.lastUpdated} numberOfLines={3}>
            {lastUpdated}
          </Text>
        </View>
        <View style={styles.closeContainer}>
          <ExIconButton
            name="close"
            color={dindleTheme.colors.text}
            size={24}
            onPress={() => onRemove(id)}
          />
        </View>
      </View>
      <View style={{ paddingLeft: 64 }}>
        <TouchableOpacity
          style={{ paddingVertical: 8 }}
          onPress={() => onOpen(item)}
        >
          <Text style={styles.open}> {t('Open')} </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ItemNotification;