import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { checkPasswordStrength, isValidEmail } from '../../../libs/functions';
import { ExTextInput } from '../ExTextInput';
import { ExAlert } from '../ExAlert';
import { DEFAULT_PRIMARY, styles } from './styles';

const defaultSignupState = {
  email: null,
  username: null,
  password: null,
  confirm: null,
};

const defaultError = {
  msg: null,
  email: false,
  username: false,
  password: false,
  confirm: false,
};

const SignUpForm = ({ signupError, primary = DEFAULT_PRIMARY, dark = true, setState = () => {}, onSignup = ()=> {}, inputStyle }) => {
  const [signup, setSignup] = React.useState(defaultSignupState);
  const [isActive, setActive] = React.useState(false);
  const [error, setError] = React.useState(defaultError);
  const { email, username, password, confirm } = signup;

  useEffect(() => {
    if (signupError) {
      setActive(false);
    }
  }, [signupError]);

  const checkForm = () => {
    if (!isValidEmail(email)) {
      return { ...error, email: true, msg: 'Email not valid' };
    }
    if (!username || username.length < 4) {
      return { ...error, username: true, msg: 'Username must have at least 4 chars' };
    }

    const { status, msg } = checkPasswordStrength(password);
    if (!status) {
      return { ...error, password: true, msg };
    }

    if (password !== confirm) {
      return { ...error, password: true, confirm: true, msg: 'Password and confirm password does not match'};
    }
    return undefined;
  };

  const onLogin = () => {
    setState({ forgot: false, signup: false });
    setSignup(defaultSignupState);
  };

  const onCreate = () => {
    if (!email && !username && !password && !confirm) {
      return;
    }
    const check = checkForm();
    if (!check) {
      setActive(true);
      return onSignup(signup);
    }
    setError(check);
  };

  const onDismiss = () => {
    setError((state) => ({ ...state, msg: null }));
  }

  const showAlert = () => {
    const { msg } = error || {};
    if (!msg) {
      return null;
    }
    return <ExAlert title="Create Account" msg={msg} show={!!msg} onDismiss={onDismiss} />
  }

  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const isValidate = () => {
    return !!checkForm() ? onCreate() : false;
  }

  return (
    <View>
      {showAlert()}
      <ExTextInput
        autoFocus
        editable={!isActive}
        inputStyle={inputStyle}
        onChangeText={(value) => setSignup({ ...signup, email: value }) || setError((state) => ({ ...state, email: false }))}
        onSubmitEditing={() => !isValidate() && usernameRef.current.focus()}
        label="Your email"
        ref={emailRef}
        value={email}
        error={error.email}
      />
      <ExTextInput
        editable={!isActive}
        error={error.username}
        inputStyle={inputStyle}
        onChangeText={(value) => setSignup({ ...signup, username: value }) || setError((state) => ({ ...state, username: false }))}
        onSubmitEditing={() => !isValidate() && passwordRef.current.focus()}
        label="Your Username"
        ref={usernameRef}
        value={username}
      />
      <ExTextInput
        editable={!isActive}
        inputStyle={inputStyle}
        onChangeText={(value) => setSignup({ ...signup, password: value })  || setError((state) => ({ ...state, password: false }))}
        onSubmitEditing={() => !isValidate() && confirmRef.current.focus()}
        label="Create Password"
        secureTextEntry
        value={password}
        ref={passwordRef}
        error={error.password}
      />
      <ExTextInput
        editable={!isActive}
        inputStyle={inputStyle}
        onChangeText={(value) => setSignup({ ...signup, confirm: value })  || setError((state) => ({ ...state, confirm: false }))}
        onSubmitEditing={() => isValidate() ? onCreate() : emailRef.current.focus()}
        label="Confirm Password"
        secureTextEntry
        value={confirm}
        error={error.confirm}
        ref={confirmRef}
      />
      <Button
        dark={dark}
        disabled={isActive}
        loading={isActive}
        mode="contained"
        onPress={() => onCreate()}
        style={styles.button}>
        CREATE ACCOUNT
      </Button>
      <View style={styles.getLink}>
        <Text>Already have an account ?</Text>
        <TouchableOpacity onPress={() => onLogin()}>
          <Text style={[styles.getLinkText, { color: primary }]}>GET LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(SignUpForm);