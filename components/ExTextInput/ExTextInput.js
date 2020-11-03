import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const styles = StyleSheet.create({
  default: {
    paddingHorizontal: 0,
    backgroundColor: '#ffffff',
  },
});

const ExTextInput = React.forwardRef((props, ref) => {
  const {
    placeholder,
    onChangeText,
    onEndEditing,
    value,
    inputStyle,
  } = props;
  return (
    <TextInput
      autoCapitalize="none"
      clearButtonMode="while-editing"
      label={placeholder}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      style={[styles.default, inputStyle]}
      value={value}
      ref={ref}
      {...props}
    />
  );
});

export default ExTextInput;