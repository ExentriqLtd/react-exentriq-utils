import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ItemNotification from './ItemNotification';

function ExBusNotification({ data, isRead, onClose, onOpen, onEndReached, UIText, ExIconButton, mapColors }){
  
  const renderItem = ({ item }) => (
    <ItemNotification 
    name={item.name} 
    notification={item.notification} 
    date={item.date} 
    UIText={UIText} 
    ExIconButton={ExIconButton} 
    mapColors={mapColors} 
    onClose={onClose}
    onOpen={onOpen}
    isRead={isRead}/>
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
