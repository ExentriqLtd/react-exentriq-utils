import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EXENTRIQ_AVATAR_URL } from 'exentriq-utils/libs/config';
import { utilityFormatDate } from 'exentriq-utils//functions/formatDate'
import { Row, Grid, Col } from 'react-native-easy-grid';

function ItemNotification(props) {
  const { t } = useTranslation();
  const { item, onRemove, onOpen, UIText, ExIconButton, mapColors } = props;
  const { from_user, subject, notified, timestamp, link_params, id } = item || {};
  const { cardId } = link_params || {};
  const lastUpdated = timestamp ? utilityFormatDate(timestamp) : '';
  const link = `channel/card/${cardId}`;

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
      borderBottomColor: mapColors.textLightGrey,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.2,
      alignItems: 'flex-start',
      backgroundColor: notified ? mapColors.backgroundColor : '#efefef',
    },
    container: {
      flexDirection: 'row',
      flex: 1,
      paddingVertical: 4
    },
    avatarContainer: {
      flexDirection: 'column',
      width: '20%',
    },
    textContainer: {
      flexDirection: 'column',
      width: '70%'
    },
    closeContainer: {
      flexDirection: 'column',
      width: '10%'
    },
    avatar: {
      height: 60,
      width: 60,
      resizeMode: 'contain',
      borderRadius: 30
    }
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
          <UIText id={from_user} size="f4" weight='bold' numberOfLines={1} buildMessage={false} />
          <UIText style={{ paddingTop: 4 }} id={subject} size="f3" numberOfLines={3} buildMessage={false} />
          <UIText style={{ paddingTop: 4 }} id={lastUpdated} color={'textLightGrey'} size="f2" buildMessage={false} />
        </View>
        <View style={styles.closeContainer}>
          <ExIconButton
            name='close'
            color={mapColors.text}
            size={24}
            onPress={() => onRemove(id)}
          />
        </View>
      </View>
      <View style={{ flexDirection: 'row', paddingLeft: '20%', width: '80%' }}>
        <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => onOpen({ link, id })}>
          <UIText id={t('Open')} color={'primary'} size="f4" style={{ textDecorationLine: 'underline' }} buildMessage={false} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ItemNotification;