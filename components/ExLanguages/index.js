import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { URL_EXENTRIQ_FEEDSERVICE } from '../../constants/config';
import { ExLanguagesSearchInput } from './ExLanguagesSearchInput';
import { ExLanguagesSingleItem } from './ExLanguagesSingleItem';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
});

export const ExLanguages = ({ containerStyle, lang, flatListProps, searchPlaceholder, ...props }) => {
  const [languagesService, setLanguagesService] = useState();
  const [languagesList, setLanguagesList] = useState();

  useEffect(() => {
    const url = `${URL_EXENTRIQ_FEEDSERVICE}?service=languages&lang=${lang}`;
    const fetchData = async () => {
      try {
        let response = await fetch(url);
        let json = await response.json();
        setLanguagesService(json.responseData);
        setLanguagesList(json.responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const searchLanguage = (search) => {
    if (!languagesService) {
      return;
    }
    let filteredList = languagesService.filter((item) => { // search from a full list, and not from a previous search results list
      if(item.language.match(search))
        return item;
      else
        return null;
    })
    setLanguagesList(filteredList);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <ExLanguagesSearchInput
        searchPlaceholder={searchPlaceholder}
        searchLanguage={searchLanguage}
      />
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={languagesList}
        renderItem={({ item }) => <ExLanguagesSingleItem isSelected={item.selected} item={item} {...props} />}
        keyExtractor={( item ) => item.code}
        scrollEventThrottle={2}
        {...flatListProps}
      />
    </View>
  );
}
ExLanguages.defaultProps = {
  primary: 'red',
}
ExLanguages.propTypes = {
  primary: PropTypes.string,
}