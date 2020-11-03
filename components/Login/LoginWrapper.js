import React, { useEffect } from 'react';
import { View } from 'react-native';
import Signup from './Signup';
import ForgotPasssword from './ForgotPassword';
import LoginForm from './LoginForm';

const defaultState = { forgot: false, signup: false };

export default function LoginWrapper(props) {
  const [state, setState] = React.useState(defaultState);
  const { forgot, signup } = state;
  const { wrapperStyle, loginError, signupError } = props;

  useEffect(() => {
    const { msg } = signupError || {};
    if (msg) {
      setState({ ...defaultState, signup: true });
    }
  }, [signupError]);

  return (
    <View style={wrapperStyle}>
      {!forgot && !signup && <LoginForm setState={setState} {...props} error={loginError} />}
      {forgot && <ForgotPasssword setState={setState} {...props} />}
      {signup && <Signup setState={setState} {...props} />}
    </View>
  );
}
