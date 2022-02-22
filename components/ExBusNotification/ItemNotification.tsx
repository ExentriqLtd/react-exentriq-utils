/* eslint-disable react-native/no-raw-text */
import React, { FC, memo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { UIText } from '../../ui/Text';
import { mapColors } from '../../../themes/maps/general/mapColors';
import ExIconButton from '../../ui/ExIconButton';

interface Props {
  name?: any;
  notification?: any;
  date?: any;
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomColor: mapColors.textLightGrey,
    borderBottomWidth: 0.2,
    alignItems: 'center'
  },
  avatarContainer: {
    flexDirection: 'column',
    width: '20%',
    paddingLeft: 8
  },
  textContainer: {
    flexDirection: 'column',
    width: '70%'
  },
  closeContainer: {
    flexDirection: 'column',
    width: '10%'
  },
});
export const ItemNotification: FC<Props> = memo(
  ({ name, notification, date }: Props): JSX.Element => {
    const open = 'Open';

    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            style={{ height: 50, width: 50, resizeMode: 'contain', borderRadius: 50 }}
            source={{
              uri: 'https://www.exentriq.com/templates/exentriqManager3/static/new-ui/img/mobile_landing/talk-icon.png',
              cache: 'default'
            }}
          />
        </View>
        <View style={styles.textContainer}>
          <UIText id={name} size="f4" weight='bold' numberOfLines={1} buildMessage={false} />
          <UIText id={notification} size="f3" numberOfLines={3} buildMessage={false} />
          <UIText id={date} color={'textLightGrey'} size="f2" buildMessage={false} />
          <TouchableOpacity onPress={()=>{}}>
            <UIText id={open} color={'primary'} size="f4" style={{ textDecorationLine: 'underline' }} buildMessage={false} />
          </TouchableOpacity>
        </View>
        <View style={styles.closeContainer}>
          <ExIconButton
            name='close'
            color={mapColors.text}
            size={24}
            onPress={() => { }}
          />
        </View>

      </View>
    );
  },
);

ItemNotification.displayName = 'ItemNotification';