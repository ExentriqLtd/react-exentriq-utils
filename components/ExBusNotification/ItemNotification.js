/** @format */

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { EXENTRIQ_AVATAR_URL } from 'exentriq-utils/libs/config';
import { utilityFormatDate } from 'exentriq-utils//functions/formatDate';

const getTranslation = ({ localized_action, t }) => {
  try {
    const { template, templateName, values } = localized_action || {};
    if (template && templateName) {
      let translated = t(templateName);
      for (x = 0; x < values.length; x += 1) {
        translated = translated.replaceAll(`{${x}}`, values[x]);
      }
      return translated;
    }
  } catch (e) {
    return undefined;
  }
  return undefined;
}

function ItemNotification(props) {
  const { item, onRemove, onOpen, ExIconButton, dindleTheme, translate: t } = props;
  const { from_user, from_name, subject: subjectProps, notified, timestamp, id } = item || {};
  const lastUpdated = timestamp ? utilityFormatDate(timestamp) : '';
  const subject = getTranslation({ ...item, t }) || subjectProps;

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
      borderBottomWidth: 0.2,
      alignItems: 'flex-start',
      backgroundColor: dindleTheme.backgroundColor,
    },
    container: {
      flexDirection: 'row',
      flex: 1,
      paddingVertical: 4,
    },
    avatarContainer: {
      paddingRight: 8,
    },
    textContainer: {
      flex: 1,
    },
    closeContainer: { marginTop: -8 },
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
    open: (notified) => ({
      fontSize: 14,
      textDecorationLine: 'underline',
      color: dindleTheme.primary,
      opacity: !notified ? 1 : 0.4,
    }),
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
            {from_name || from_user}
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
          <Text style={styles.open(notified)}> {t('Open')} </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ItemNotification;