import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ItemNotification from './ItemNotification';


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

function ExBusNotification({ data, onClose, onOpen, UIText, ExIconButton, mapColors }){
  
  const renderItem = ({ item }) => (
    <ItemNotification 
    name={item.name} 
    notification={item.notification} 
    date={item.date} 
    UIText={UIText} 
    ExIconButton={ExIconButton} 
    mapColors={mapColors} 
    onClose={onClose}
    onOpen={onOpen}/>
  );
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export { ExBusNotification };
