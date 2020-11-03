import React, { useCallback, useEffect, useRef } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { ExTextInput } from '../ExTextInput';
import { DEFAULT_PRIMARY, styles } from './styles';

const resetLogin = () => ({
  username: '',
  password: '',
});

export default function LoginForm(props) {
  const { loginError, primary = DEFAULT_PRIMARY, dark = true, inputStyle, setState = () => {}, loading, onLogin = () => {} } = props;
  const [login, setLogin] = React.useState(resetLogin());
  const [isActive, setActive] = React.useState(false);
  const { username, password } = login;

  useEffect(() => {
    if (!loginError) {
      setActive(false);
    }
  }, [loginError]);

  const checkLogin = () => {
    if (!username) {
      return false;
    }
    if (!password) {
      return false;
    }
    return true;
  };

  const onPressLogin = useCallback(() => {
    if (!checkLogin() || isActive) {
      return;
    }
    setActive(true);
    onLogin(login);
  }, [isActive, onLogin, setActive, checkLogin]);

  const onForgot = () => setState({ forgot: true, signup: false });
  const onSignUp = () => setState({ forgot: false, signup: true });

  const returnKeyType = (username && password) ? 'go' : 'default';
  const passwordRef = React.useRef(null);


  return (
    <View>
      <ExTextInput
        autoCapitalize="none"
        autoFocus
        clearButtonMode="while-editing"
        inputStyle={inputStyle}
        label="Username / Email"
        onChangeText={(value) => setLogin({ ...login, username: value })}
        onSubmitEditing={() => passwordRef.current.focus()}
        returnKeyType="next"
        value={login.username}
      />
      <ExTextInput
        autoCapitalize="none"
        clearButtonMode="while-editing"
        inputStyle={inputStyle}
        label="Password"
        onChangeText={(value) => setLogin({ ...login, password: value })}
        onSubmitEditing={(value) => onPressLogin()}
        returnKeyType={returnKeyType}
        ref={passwordRef}
        secureTextEntry
        type="password"
        value={login.password}
      />
      <View style={styles.forgot}>
        <View>
          <TouchableOpacity disabled={isActive} onPress={() => onForgot()}>
            <Text style={[styles.forgotText, { color: primary }]}>Forgot your Password ?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button
        disabled={isActive}
        loading={isActive}
        dark={dark}
        style={styles.button}
        mode="contained"
        onPress={() => onPressLogin()}>
        Login
      </Button>
      <View style={styles.getLink}>
        <Text>Don't have an account ?</Text>
        <TouchableOpacity disabled={isActive} onPress={() => onSignUp()}>
          <Text style={[styles.getLinkText, { color: primary }]}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
