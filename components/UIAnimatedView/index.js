/** @format */

// #region ::: IMPORT
import React, { memo } from 'react';
import { Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// #endregion

// #region ::: PARTIALS
const UIAnimated = styled(Animated.View)`
  display: ${({ visible }) => visible ? 'none': 'flex'};
  flex: 1;
  background: ${({ theme, backgroundColor }) =>
    backgroundColor ? theme.colors[backgroundColor] : theme.colors.white};
`;
// #endregion

export const UIAnimatedView = memo(
  ({ children, backgroundColor = 'white', styles, show }) => {
    const opacity = React.useRef(new Animated.Value(1)).current;
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
      Animated.timing(opacity, {
        toValue: show ? 0 : 1,
        duration: show ? duration : 10,
        easing: Easing.circle,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setVisible(!visible);
        }
      });
    }, [show]);

    return (
    <UIAnimated backgroundColor={backgroundColor} style={[styles, { opacity }]} visible={visible}>{children}</UIAnimated>
    );
  },
);

UIAnimatedView.defaultProps = {
  backgroundColor: 'white',
  show: false,
  styles: undefined,
  duration: 1000
}

UIAnimatedView.propTypes = {
  duration: PropTypes.number,
  styles: PropTypes.object,
  backgroundColor: PropTypes.string,
  show: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

UIAnimatedView.displayName = 'UIAnimatedView';
