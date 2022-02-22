/* eslint-disable react-native/no-raw-text */
import React, { FC, memo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ItemNotification } from './ItemNotification';

interface Props {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  flex: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
});
const DATA = [
  {
    id:'34567svbhdsb67',
    name: 'Fabrizio Corpora',
    notification: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    date: '1 hour ago',
  },
  {
    id:'45678hsnxjy765rtfgwq',
    name: 'DEMO LUCA INGLESE DEVICE DEMO DEMO',
    notification: 'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    date: '5 hours ago',
  },
  {
    id:'cfgvhbjksa45678',
    name: 'Andrea Pitzianti',
    notification: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    date: '6 hours ago',
  },
  {
    id:'fghjkasxvhbaj768',
    name: 'Manuel Crimi',
    notification: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    date: '2 hours ago',
  },
  {
    id:'rtfghbjnasmkz67892o1',
    name: 'Carlotta Armenise',
    notification: 'ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo',
    date: '8 hours ago',
  },

];


export const ExBusNotification: FC<Props> = memo(
  ({}: Props): JSX.Element => {

  const renderItem = ({ item }:any) => (
    <ItemNotification name={item.name} notification={item.notification} date={item.date} />
  );

  return (
    <View style={styles.flex}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
},
);

ExBusNotification.displayName = 'ExBusNotification';
