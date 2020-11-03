import { StyleSheet } from 'react-native';
export const DEFAULT_PRIMARY = '#1BBC9B';

export const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    marginTop: 16,
  },
  getLink: {
    paddingTop: 16,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  getLinkText: {
    marginLeft: 8,
  },
  forgot: {
    marginVertical: 16,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotText: {
    textTransform: 'uppercase',
  },
});
