/** @format */

import React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { APP_NAME } from '../../constants/config'

function AvatarInitials({
    backgroundColor,
    textColor,
    fontSize,
    height,
    width,
    borderRadius,
    item,
    ...props
}) {

 const styles = StyleSheet.create({
    placeholderText: {
     color: textColor ? textColor : 'white',
    },
    placeholderContainer: {
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: backgroundColor,
     height: height ? height : 35,
     width: width ? width : 35,
     borderRadius: borderRadius ? borderRadius : 50,
    },
    contactItemTitleStyle: {
     fontSize: fontSize ? fontSize : 18,
    },
 });
 const { familyName, givenName, company, firstName, lastName, companyName } = item || {};
 let displayNameEDO = `${familyName} ${givenName}`.trim();
 let displayNameTalk = `${firstName} ${lastName}`.trim();
 if (APP_NAME === 'dindle' && !familyName && !givenName) {
   displayNameEDO = company || 'unknown';
 }else if(APP_NAME === 'talk' && !firstName && !lastName){
   displayNameTalk = companyName || 'unknown';
 }

 let displayName = APP_NAME === 'dindle' ? displayNameEDO : displayNameTalk;
 const getAvatarInitials = (textString) => {
 let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
 let match;
 let initials = [];
 while ((match = rgx.exec(textString)) !== null) {
  initials.push(match[0]);
 }
 initials = (
  (initials.shift()?.[0] || '') + (initials.pop()?.[0] || '')
  ).toUpperCase();
  return initials;
 };

return (
 <>
  {item &&
   <View style={styles.placeholderContainer}>
    <View style={styles.placeholderContainer}>
     <Text
      adjustsFontSizeToFit
      numberOfLines={1}
      minimumFontScale={0.01}
      style={[{ fontSize: Math.round(46) / 2 }, styles.placeholderText]}
      {...props}>
        {getAvatarInitials(displayName)}
     </Text>
    </View>
   </View>
  }
 </>
);
}

export { AvatarInitials };
