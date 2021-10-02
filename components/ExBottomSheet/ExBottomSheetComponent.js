import { useKeyboard } from '@react-native-community/hooks';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import { ExLanguagesSearchInput } from '../ExLanguages/ExLanguagesSearchInput';
import ExBottomSheetHandle from './ExBottomSheetHandle';
import useExBottomSheet from './useExBottomSheet';
import { URL_EXENTRIQ_FEEDSERVICE } from '../../constants/config';
import { ExLanguagesSingleItem } from '../ExLanguages/ExLanguagesSingleItem';

function ExBottomSheetComponent({ show, component }) {
  const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
  const snapPointsFromTop = [50, windowHeight + 250];
  const animatedPosition = useRef();
  const { title, props } = component || {};
  const { lang } = component || 'en';

  const bottomRef = useRef();
  const keyboard = useKeyboard();
  const { keyboardShown, keyboardHeight } = keyboard || {};
  const { close } = useExBottomSheet();
  const [languagesService, setLanguagesService] = useState();
  const [languagesList, setLanguagesList] = useState();

  useEffect(() => {
    if (!lang) {
      return;
    }
    const url = `${URL_EXENTRIQ_FEEDSERVICE}?service=languages&lang=${lang}`;

    const fetchData = async () => {
      try {
        let response = await fetch(url);
        let json = await response.json();
        setLanguagesService(json.responseData);
        setLanguagesList(json.responseData);
      } catch (error) {
        console.error('Retreive Language List', error);
      }
    };
    if (lang) {
      fetchData();
    }
  }, [lang]);

  const closeSheet = () => {
    bottomRef.current?.snapTo(1);
    Keyboard.dismiss;
    close();
  };

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

  if (!show || !component || !languagesList) {
    return null;
  }

  const renderHandle = () => {
    return (
      <View>
        <ExBottomSheetHandle title={title} onCancel={closeSheet} {...props} />
        <ExLanguagesSearchInput searchLanguage={searchLanguage}/>
      </View>
    );
  };

  return (
    <ScrollBottomSheet
      keyboardShouldPersistTaps="handled"
      ref={bottomRef}
      enableOverScroll
      componentType="FlatList"
      onSettle={(index) => {
        if (index === 1) {
          Keyboard.dismiss();
          closeSheet();
        }
      }}
      animatedPosition={animatedPosition.current}
      animationConfig={{ duration: 300 }}
      snapPoints={snapPointsFromTop}
      onEndReachedThreshold={0.1}
      initialSnapIndex={show ? 0 : 1}
      scrollUpAndPullDown
      animationType="timing"
      renderHandle={renderHandle}
      data={languagesList}
      keyExtractor={( item ) => item.code}
      renderItem={({ item }) => <ExLanguagesSingleItem isSelected={item.selected} item={item} onClose={closeSheet} {...props} />}
      contentContainerStyle={styles.contentContainerStyle}
      containerStyle={{ paddingBottom: Platform.OS === 'ios' ? (keyboardShown ? keyboardHeight : 22) : 0 }}
      style={{backgroundColor: 'white'}}
    />
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 0,
  },
});

export default ExBottomSheetComponent;
