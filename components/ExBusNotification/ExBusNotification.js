import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ItemNotification from './ItemNotification';

function ExBusNotification({ data, onRemove, onOpen, onEndReached, UIText, ExIconButton, mapColors }){
  
  const renderItem = ({ item }) => (
    <ItemNotification 
    item={item}
    UIText={UIText} 
    ExIconButton={ExIconButton} 
    mapColors={mapColors} 
    onRemove={onRemove}
    onOpen={onOpen} />
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