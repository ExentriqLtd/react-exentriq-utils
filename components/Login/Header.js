/* eslint-disable react-native/no-color-literals */
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';

const Header = ({ logo, backgroundImage, headerStyle }) => {
  const { logoStyle, containerLogoStyle } = headerStyle || {};
  return (
    <View>
      <ImageBackground
        accessibilityRole="image"
        source={backgroundImage}
        style={[
          styles.background,
          !backgroundImage ? styles.backgroundDefault : undefined,
        ]}>
        <View style={[styles.container, containerLogoStyle]}>
          <Text style={styles.text}>Welcome to</Text>
          {logo && (
            <View style={styles.containerLogo}>
              <Image style={[styles.logo, logoStyle]} source={logo} />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'black',
    justifyContent: 'flex-start',
  },
  background: {
    opacity: 1,
  },
  backgroundDefault: {
    backgroundColor: '#1bbc9b',
  },
  containerLogo: {
    width: '100%',
    maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    opacity: 1,
    overflow: 'visible',
    width: '100%',
    height: 40,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
    color: 'white',
    paddingTop: 4,
  },
});

export default Header;
