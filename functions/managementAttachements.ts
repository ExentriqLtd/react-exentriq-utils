/** @format */

import memoize from "fast-memoize";
import ImagePickerCrop from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

export const attachmentsPickerCrop = async (isMultiUpload:boolean) => {
  let res = await ImagePickerCrop.openPicker({
    multiple: isMultiUpload,
    mediaType: "any"
  });
  return res;
}

export const attachmentsDocumentMultiPicker = async () => 
{
  let res = await DocumentPicker.pickMultiple({
  allowMultiSelection: false,
  type: [DocumentPicker.types.allFiles]
});
  return res;
}
export const attachmentsDocumentSinglePicker = async () => 
{
  let res = await DocumentPicker.pickSingle({
  type: [DocumentPicker.types.allFiles]
});
  return res;
}