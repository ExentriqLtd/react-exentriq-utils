/** @format */

import memoize from "fast-memoize";
import ImagePickerCrop from 'react-native-image-crop-picker';

export const attachmentsPickerCrop = async (isMultiUpload:boolean) => {
  let res = await ImagePickerCrop.openPicker({
    multiple: isMultiUpload,
    mediaType: "any"
  });
  return res;
}