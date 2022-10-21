/** @format */
import ImagePickerCrop from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { Alert, Linking } from 'react-native';

export const attachmentsPickerCrop = async (isMultiUpload:boolean) => {
  const res = await ImagePickerCrop.openPicker({
    multiple: isMultiUpload,
    mediaType: "any"
  });
  return res;
}

export const attachmentsPicker = (isMultiUpload:boolean) => {
  return new Promise((resolve, reject) => {
    ImagePickerCrop.openPicker({
      maxFiles: 20,
      multiple: isMultiUpload,
      mediaType: "any",
      forceJpg: true,
    }).then(resolve)
    .catch((error) => {
      if(error.code === "E_NO_LIBRARY_PERMISSION") {
        reject(error.code);
      }
    })
  })
}

export const attachmentsDocumentMultiPicker = async (isMultiUpload:boolean) =>
{
  const res = await DocumentPicker.pickMultiple({
    allowMultiSelection: isMultiUpload,
    type: [DocumentPicker.types.allFiles]
  });
  return res;
}

export const attachmentsDocumentSinglePicker = async () =>
{
  const res = await DocumentPicker.pickSingle({
    type: [DocumentPicker.types.allFiles]
  });
  return res;
}

export const attachmentsDocumentPicker = (isMultiUpload:boolean) => {
  return new Promise((resolve, reject) => {
    DocumentPicker.pickMultiple({
      allowMultiSelection: isMultiUpload,
      type: [DocumentPicker.types.allFiles]
    }).then(resolve)
    .catch((error:any) => {
      if(error.code === "E_NO_LIBRARY_PERMISSION") {
        reject(error.code);
      }
    })
  })
}

export const launchAlertErrorSettings = (errorMessage:string, errorTitle: string, openSettings: string, cancel:string) => {
  Alert.alert(errorTitle, errorMessage, [
    {
      text: openSettings,
      onPress: () => Linking.openSettings(),
    },
    {
      text: cancel,
      style: 'cancel',
    },
  ]);
};