import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import ExLinearGradient from './ExLinearGradient';

const styles = StyleSheet.create({
  gradientStyle: {
    borderRadius: 4,
  },
  buttonStyle: {
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    width: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  labelStyle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '800',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

function ExGradientButton(props) {
  const { text, onPress, styleGradient, styleButton, labelStyle } = props;

  return (
    <View>
      <TouchableOpacity style={[styles.buttonStyle, styleButton]}>
        <ExLinearGradient style={[styles.gradientStyle, styleGradient]}>
          <Button
            mode="text"
            onPress={onPress}
            labelStyle={[styles.labelStyle, labelStyle]}
            {...props}>
            {text}
          </Button>
        </ExLinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default ExGradientButton;
