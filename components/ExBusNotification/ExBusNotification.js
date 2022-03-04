/** @format */

import React from 'react';
import { View, FlatList } from 'react-native';
import ItemNotification from './ItemNotification';

function ExBusNotification({
  data,
  onRemove,
  onOpen,
  onEndReached,
  ExIconButton,
  dindleTheme,
}) {
  const renderItem = ({ item }) => (
    <ItemNotification
      item={item}
      ExIconButton={ExIconButton}
      dindleTheme={dindleTheme}
      onRemove={onRemove}
      onOpen={onOpen}
    />
  );
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0}
        onEndReached={onEndReached}
      />
    </View>
  );
}

export { ExBusNotification };
