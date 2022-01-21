import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

function ExLinearGradient({
  theme,
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
  return (
    <LinearGradient
      start={theme.linearGradient.start}
      end={theme.linearGradient.end}
      colors={selected ? theme.linearGradient.colors : disabledColors}
      style={style}
      useAngle={theme.linearGradient.useAngle}
      angle={theme.linearGradient.angle}
      angleCenter={theme.linearGradient.angleCenter}
      {...restProps}>
      {children}
    </LinearGradient>
  );
}

ExLinearGradient.defaultProps = {
  selected: true,
  disabledColors: ['#FFF', '#FFF'],
  children: null,
  backgroundColor:"white",
};

ExLinearGradient.propTypes = {
  children: PropTypes.node,
  style: PropTypes.any,
  selected: PropTypes.bool,
  disabledColors: PropTypes.arrayOf(PropTypes.string),
  backgroundColor: PropTypes.string,
};

export default ExLinearGradient;

