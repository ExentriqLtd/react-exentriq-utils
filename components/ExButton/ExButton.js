import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import ExLinearGradient from '../ExLinearGradient';

const styles = StyleSheet.create({
  containerButton: {
    marginVertical: 8,
    shadowColor: dindleTheme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 4.22,
    elevation: 3,
  },
  gradient: {
    borderRadius: 6,
  },
  labelStyleDefault: {
    fontWeight: '600',
  },
});
function ExButton({
  style,
  text,
  icon,
  textColor,
  buttonStyle,
  linearStyle,
  onPress,
  labelStyle,
  uppercase,
  disabled,
}) {
  const disabledColors = disabled
    ? dindleTheme.linearGradient.disabledColors
    : undefined;
  return (
    <View style={[styles.containerButton, style]}>
      <ExLinearGradient
        selected={!disabled}
        style={[styles.gradient, linearStyle]}
        disabledColors={disabledColors}>
        <Button
          disabled={disabled}
          uppercase={uppercase}
          color={textColor}
          icon={icon}
          onPress={onPress}
          labelStyle={[styles.labelStyleDefault, labelStyle]}
          style={[styles.buttonDefault, buttonStyle]}>
          {text}
        </Button>
      </ExLinearGradient>
    </View>
  );
}

ExButton.defaultProps = {
  textColor: dindleTheme.colors.whiteText,
  uppercase: false,
};

ExButton.propTypes = {
  textColor: PropTypes.string,
  uppercase: PropTypes.bool,
};

export default ExButton;
