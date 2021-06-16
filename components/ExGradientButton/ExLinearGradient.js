import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

function ExLinearGradient({
  children,
  selected,
  style,
  disabled,
  disabledColors,
  noGradient,
  backgroundColor,
  ...restProps
}) {
  if (noGradient) {
    return <View style={[style, { backgroundColor }]}>{children}</View>;
  }
  const linearGradient= {
    colors: ['#F04592', '#F9C34C'],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
    locations: [0.0, 1.0],
    useAngle: true,
    angle: 45,
    angleCenter: { x: 0.5, y: 0.5 },
    disabledColors: ['#e0e0e0', '#fafafa'],
  };
  return (
    <LinearGradient
      start={linearGradient.start}
      end={linearGradient.end}
      colors={selected ? linearGradient.colors : disabledColors}
      style={style}
      useAngle={linearGradient.useAngle}
      angle={linearGradient.angle}
      angleCenter={linearGradient.angleCenter}
      {...restProps}>
      {children}
    </LinearGradient>
  );
}

ExLinearGradient.defaultProps = {
  selected: true,
  disabledColors: ['#FFF', '#FFF'],
  children: null,
  backgroundColor: 'white',
};

ExLinearGradient.propTypes = {
  children: PropTypes.node,
  style: PropTypes.any,
  selected: PropTypes.bool,
  disabledColors: PropTypes.arrayOf(PropTypes.string),
  backgroundColor: PropTypes.string,
};

export default ExLinearGradient;
