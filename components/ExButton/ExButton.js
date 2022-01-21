import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ExLinearGradient } from '../ExLinearGradient'

const styles = StyleSheet.create({
  containerButton: {
    marginVertical: 8,
    shadowColor: "black",
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

  let linearGradient =  {
    colors: ['#F04592', '#F9C34C'],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
    locations: [0.0, 1.0],
    useAngle: true,
    angle: 45,
    angleCenter: { x: 0.5, y: 0.5 },
    disabledColors: ['#e0e0e0', '#fafafa'],
  };

  // const disabledColors = disabled
  //   ? dindleTheme.linearGradient.disabledColors
  //   : undefined;
  return (
    <View style={[styles.containerButton, style]}>
      <ExLinearGradient
        theme={{ linearGradient }}
        selected={!disabled}
        style={[styles.gradient, linearStyle]}
        >
          {/* disabledColors={disabledColors}> */}
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
  textColor: "white",
  uppercase: false,
};

ExButton.propTypes = {
  textColor: PropTypes.string,
  uppercase: PropTypes.bool,
};

export default ExButton;
