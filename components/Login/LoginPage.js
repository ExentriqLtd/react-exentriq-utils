/* eslint-disable react-native/no-color-literals */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
} from 'react-native';
import Header from './Header';
import LoginWrapper from './LoginWrapper';

function LoginPage({ noHeader, ...props }) {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.header}>
            {!noHeader && <Header {...props} />}
          </View>
          <View style={styles.wrapper}>
            <LoginWrapper {...props} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'transparent',
    height: '100%',
  },
  header: {
    width: '100%',
    maxHeight: 210,
  },
  wrapper: {
    paddingHorizontal: 8,
    width: '100%',
    borderWidth: 0,
    borderColor: 'pink',
  },
});

export default LoginPage;
