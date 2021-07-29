import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  container: {
    backgroundColor: 'white'
  }
});

export const ExLanguagesSearchInput = ({ searchPlaceholder, searchLanguage, ...props }) => {

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={searchPlaceholder}
        onChangeText={searchLanguage}
        autoCompleteType={'off'}
        autoCorrect={false}
        clearButtonMode={'while-editing'}
        {...props}
      />
    </View>  
  );
}
ExLanguagesSearchInput.defaultProps = {
  searchPlaceholder: 'Search',
  searchLanguage: null,
}
ExLanguagesSearchInput.propTypes = {
  searchPlaceholder: PropTypes.string,
  searchLanguage: PropTypes.func,
}