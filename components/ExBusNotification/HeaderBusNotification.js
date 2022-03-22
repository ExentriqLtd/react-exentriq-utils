/** @format */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems:'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  text: (color) => ({
    textDecorationLine: 'underline',
    color,
    fontSize: 16,
  }),
});

export const HeaderBusNotification = memo(({ label, labelColor, remove }) => {
  if (!label) return null;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={remove} style={styles.button}>
        <Text style={styles.text(labelColor)}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
});

HeaderBusNotification.defaultProps = {
  label: null,
  labelColor: '#fff',
  remove: undefined,
};

HeaderBusNotification.propTypes = {
  label: PropTypes.string,
  labelColor: PropTypes.string,
  remove: PropTypes.func,
}

HeaderBusNotification. displayName = 'HeaderBusNotification';
