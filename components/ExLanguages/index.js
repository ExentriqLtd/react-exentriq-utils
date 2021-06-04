import { Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { URL_EXENTRIQ_FEEDSERVICE } from "../../libs/config";
import { FlatList } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  input: {
    fontSize: 17,
    marginRight: 8,
    marginLeft: 8,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scrollview: {
    width: '100%',
    padding: 12,
  },
  btn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fe8a71',
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 0.3 * 4, height: 0.5 * 4},
    shadowOpacity: 0.2,
    shadowRadius: 0.7 * 4,
  },
  safeareview: {
    justifyContent: 'center',
    flex: 1,
  },
  btnTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const LanguageItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'red', borderBottomColor: '#000', borderBottomWidth: 1, padding: 4}} onPress={onPress}>
        <Image
          source={{
            height: 50,
            width: 50,
            uri: 'https://www.countryflags.io/' + item.code + '/flat/64.png',
          }}
          resizeMode="cover"
          style={{ borderRadius: 50, borderWidth: 3, borderColor: 'blue'}}
        />
        <Text>
          {item.language}
        </Text>
    </TouchableOpacity>
  );
}; 

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
    let filteredList = languagesService.filter((item) => { // search from a full list, and not from a previous search results list
      if(item.language.match(search))
        return item;
      else 
        return null;
    })
    setLanguagesList(filteredList);
  };
  
  return (
    <View style={containerStyle}>
      <TextInput
        style={styles.input}
        placeholder={searchPlaceholder}
        onChangeText={searchLanguage}
      />
      <FlatList
        data={languagesList}
        renderItem={({ item }) => <LanguageItem item={item} {...props} />}
        keyExtractor={( item ) => item.code}
        scrollEventThrottle={2}
        {...flatListProps}
      />
    </View>
  );
}