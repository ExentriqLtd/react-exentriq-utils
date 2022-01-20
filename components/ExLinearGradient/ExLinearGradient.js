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
  return (
    <LinearGradient
      start={dindleTheme.linearGradient.start}
      end={dindleTheme.linearGradient.end}
      colors={selected ? dindleTheme.linearGradient.colors : disabledColors}
      style={style}
      useAngle={dindleTheme.linearGradient.useAngle}
      angle={dindleTheme.linearGradient.angle}
      angleCenter={dindleTheme.linearGradient.angleCenter}
      {...restProps}>
      {children}
    </LinearGradient>
  );
}

ExLinearGradient.defaultProps = {
  selected: true,
  disabledColors: ['#FFF', '#FFF'],
  children: null,
  backgroundColor: dindleTheme.colors.whiteText,
};

ExLinearGradient.propTypes = {
  children: PropTypes.node,
  style: PropTypes.any,
  selected: PropTypes.bool,
  disabledColors: PropTypes.arrayOf(PropTypes.string),
  backgroundColor: PropTypes.string,
};

export default ExLinearGradient;
