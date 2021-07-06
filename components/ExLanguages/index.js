import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, TouchableOpacity, Text } from 'react-native';
import { URL_EXENTRIQ_FEEDSERVICE, FLAG_URL } from "../../libs/config";
import { FlatList } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  listContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#eee', 
    borderBottomWidth: 1, 
    padding: 8
  },
  listContainerInner: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  flagContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flag: {
    borderRadius: 50, 
    width: 50, 
    height: 50,
  }
});

const LanguageItem = ({ item, onPress, primary, selectionLanguage, onClose }) => {
  return (
    <TouchableOpacity style={styles.listContainer} onPress={() => {onPress(item); onClose()}}>
      <View style={styles.listContainerInner}>
        <View style={styles.flagContainer}>
          <Image
            source={{
              uri: `${FLAG_URL}${item.code}.png`,
            }}
            style={styles.flag}
          />
        </View>
        <Text style={{marginLeft: 12}}>
          {item.language}
        </Text>
      </View>
      <View>
      {selectionLanguage === item.code &&
        <MaterialIcons
          color={primary}
          name="check"
          style={styles.addmemberAsssigned}
          size={30}
        />
      }
      </View>
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
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={styles.input}
        placeholder={searchPlaceholder}
        onChangeText={searchLanguage}
        autoCompleteType={'off'}
        autoCorrect={false}
        clearButtonMode={'while-editing'}
      />
      <FlatList
        data={languagesList}
        renderItem={({ item }) => <LanguageItem isSelected={item.selected} item={item} {...props} />}
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