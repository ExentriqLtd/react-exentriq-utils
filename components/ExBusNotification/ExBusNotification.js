/** @format */

import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import ItemNotification from './ItemNotification';
import { HeaderBusNotification } from './HeaderBusNotification';

function ExBusNotification({
  data,
  onRemove,
  onOpen,
  onEndReached,
  ExIconButton,
  dindleTheme,
  ListEmptyComponent,
  containerStyle,
  flatListProps,
  removeAll,
  labelRemove,
  labelColor,
  translate,
}) {
  const renderItem = ({ item }) => (
    <ItemNotification
      item={item}
      ExIconButton={ExIconButton}
      dindleTheme={dindleTheme}
      onRemove={onRemove}
      onOpen={onOpen}
      translate={translate}
    />
  );
  return (
    <View style={{ ...containerStyle }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={() => <HeaderBusNotification remove={removeAll} notifications={data} label={data && data.length > 0 && labelRemove} labelColor={labelColor} />}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        ListEmptyComponent={ListEmptyComponent}
        scrollEnabled={data && data.length >0}
        {...flatListProps}
      />
    </View>
  );
}

ExBusNotification.defaultProps = {
  data: [],
  onRemove: undefined,
  onOpen: undefined,
  onEndReached: undefined,
  ExIconButton: null,
  dindleTheme: undefined,
  ListEmptyComponent: null,
  containerStyle: undefined,
  flatListProps: undefined,
  removeAll: undefined,
  labelRemove: null,
  labelColor: null,
  translate: undefined,
}

ExBusNotification.propTypes = {
  data: PropTypes.any,
  onRemove: PropTypes.func,
  onOpen: PropTypes.func,
  onEndReached: PropTypes.func,
  ExIconButton: PropTypes.any,
  dindleTheme: PropTypes.any,
  ListEmptyComponent: PropTypes.any,
  containerStyle: PropTypes.any,
  flatListProps: PropTypes.any,
  removeAll: PropTypes.func,
  labelRemove: PropTypes.string,
  labelColor: PropTypes.string,
  translate: PropTypes.func,
}

export { ExBusNotification };
