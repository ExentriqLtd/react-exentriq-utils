import React, { useCallback } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { isValidEmail } from '../../libs/functions';
import { ExTextInput } from '../ExTextInput';
import { ExAlert } from '../ExAlert';
import { DEFAULT_PRIMARY, styles } from '../Login/styles';

export default function ForgotPasssword({ primary = DEFAULT_PRIMARY, dark = true, setState, loading, onReset, inputStyle }) {
  const [email, setEmail] = React.useState(null);
  const [isActive, setActive] = React.useState(false);
  const [error, setError] = React.useState(false);

  const onLogin = () => setState({ forgot: false, signup: false });
  const onResetPassword = useCallback(() => {
    if (!email) {
      return;
    }
    if (!isValidEmail(email)) {
      setError(true);
      setActive(false);
      return;
    }
    setActive(true);
    onReset({ email });
  }, [email, onReset]);

  const onDismiss = () => {
    setActive(false);
    onLogin();
  }

  const msg = 'Please check your email, we will send you an email with a link to reset your password';
  const onDismissError = () => setError(false);
  return (
    <View>
      <ExAlert show={error} title="Recovery Password" msg="Incorrect email inserted" onDismiss={onDismissError} />
      <ExTextInput
        autoFocus
        autoCapitalize="none"
        clearButtonMode="while-editing"
        label="Email"
        editable={!isActive}
        value={email}
        inputStyle={inputStyle}
        onChangeText={(value) => setEmail(value)}
        onSubmitEditing={() => onResetPassword()}
      />
      <Button
        dark={dark}
        disabled={isActive}
        loading={isActive}
        mode="contained"
        onPress={() => onResetPassword()}
        style={styles.button}>
        RESET PASSWORD
      </Button>
      <View style={styles.forgot}>
        <View>
          <TouchableOpacity onPress={() => onLogin()}>
            <Text style={[styles.forgotText, { color: primary }]}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ExAlert show={isActive} msg={msg} title="Reset" onDismiss={onDismiss} />
    </View>
  );
}