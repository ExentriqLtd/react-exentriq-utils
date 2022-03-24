/** @format */

import React from 'react';
import { View, StyleSheet, Text} from 'react-native';

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
     color: textColor,
    },
    placeholderContainer: {
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: backgroundColor,
     height: height,
     width: width,
     borderRadius: borderRadius,
    },
    contactItemTitleStyle: {
     fontSize: fontSize,
    },
 });
 const { familyName, givenName, company } = item || {};
 let displayName = `${familyName} ${givenName}`.trim();
 if (!familyName && !givenName) {
  displayName = company || 'unknown';
 }
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
