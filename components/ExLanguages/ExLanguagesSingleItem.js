import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { FLAG_URL } from "../../libs/config";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
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

export const ExLanguagesSingleItem = ({ item, onPress, primary, selectionLanguage, onClose }) => {
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

ExLanguagesSingleItem.defaultProps = {
  item: {},
  onPress: null,
  onClose: null,
  primary: 'red',
  selectionLanguage: '',
}
ExLanguagesSingleItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
  onClose: PropTypes.func,
  primary: PropTypes.string,
  selectionLanguage: PropTypes.string,
}