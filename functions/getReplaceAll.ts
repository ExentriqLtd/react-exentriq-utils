/** @format */

import { isString } from 'lodash';

export const GetReplaceAll = function (str, search, replacement) {
  var newStr = ''
   if (isString(str)) { // maybe add a lodash test? Will not handle numbers now.
    newStr = str.split(search).join(replacement)
   }
  return newStr
}