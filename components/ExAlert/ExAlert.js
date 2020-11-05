import { Alert } from 'react-native';

export default function ExAlert({ show, title, msg, onDismiss }) {
  if (!!show) {
    Alert.alert(
      title,
      msg,
      [
        {
          text: "OK",
          onPress: () => onDismiss(),
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
  }
  return null;
}