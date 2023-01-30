import { Alert, Platform } from 'react-native';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
const fnGoToSetting = (message: string) => {
  Alert.alert('Access permission', message, [
    {
      text: 'Cancel',
      onPress: () => {
        return;
      },
    },
    {
      text: 'Go to Settings',
      onPress: async () => {
        await openSettings();
      },
    },
  ]);
};

export const requestCameraPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const resultAnd = await check(PERMISSIONS.ANDROID.CAMERA);
      console.log('PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE', resultAnd);

      switch (resultAnd) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          fnGoToSetting('Stump would like to access photos, media, files on your device?');
          return false;
        case RESULTS.DENIED:
          const granted = await request(PERMISSIONS.ANDROID.CAMERA);
          if (granted !== RESULTS.GRANTED && granted !== RESULTS.LIMITED) {
            fnGoToSetting('Stump would like to access photos, media, files on your device?');
          }
          return granted === RESULTS.GRANTED;
        default:
          return false;
      }
    } else {
      const resultIOS = await check(PERMISSIONS.IOS.CAMERA);
      console.log(resultIOS, `step 1`);
      switch (resultIOS) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.LIMITED:
          return true;
        default: {
          const granted = await request(PERMISSIONS.IOS.CAMERA);
          console.log(granted, `step2`);
          if (granted === RESULTS.BLOCKED || granted === RESULTS.UNAVAILABLE) {
            fnGoToSetting('Stump would like to access photos, media, files on your device?');
          }
          return granted === RESULTS.GRANTED;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const requestStoragePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const resultAnd = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      console.log('PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE', resultAnd);

      switch (resultAnd) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          fnGoToSetting('Stump would like to access photos, media, files on your device?');
          return false;
        case RESULTS.DENIED:
          const granted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
          if (granted !== RESULTS.GRANTED && granted !== RESULTS.LIMITED) {
            fnGoToSetting('Stump would like to access photos, media, files on your device?');
          }
          return granted === RESULTS.GRANTED;
        default:
          return false;
      }
    } else {
      const resultIOS = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      console.log(resultIOS, `step 1`);
      switch (resultIOS) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.LIMITED:
          return true;
        default: {
          const granted = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          console.log(granted, `step2`);
          if (granted === RESULTS.BLOCKED || granted === RESULTS.UNAVAILABLE) {
            fnGoToSetting('Stump would like to access photos, media, files on your device?');
          }
          return granted === RESULTS.GRANTED;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const requestMicroPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const resultAnd = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
      console.log('PERMISSIONS.ANDROID.RECORD_AUDIO', resultAnd);

      switch (resultAnd) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          fnGoToSetting('Stump would like to access microphone on your device?');
          return false;
        case RESULTS.DENIED:
          const granted = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          if (granted !== RESULTS.GRANTED && granted !== RESULTS.LIMITED) {
            fnGoToSetting('Stump would like to access microphone on your device?');
          }
          return granted === RESULTS.GRANTED;
        default:
          return false;
      }
    } else {
      const resultIOS = await check(PERMISSIONS.IOS.MICROPHONE);
      console.log(resultIOS, `step 1`);
      switch (resultIOS) {
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        default: {
          const granted = await request(PERMISSIONS.IOS.MICROPHONE);
          console.log(granted, `step 2`);
          if (granted === RESULTS.BLOCKED || granted === RESULTS.UNAVAILABLE) {
            fnGoToSetting('Stump would like to access microphone on your device?');
          }
          return granted === RESULTS.GRANTED;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const requestContactPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const resultAnd = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
      console.log('PERMISSIONS.ANDROID.READ_CONTACTS', resultAnd);

      switch (resultAnd) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          fnGoToSetting('Stump would like to access to your contacts?');
          return false;
        case RESULTS.DENIED:
          const granted = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
          if (granted === RESULTS.BLOCKED) {
            fnGoToSetting('Stump would like to access to your contacts?');
          }
          return granted === RESULTS.GRANTED ? true : false;
        default:
          return false;
      }
    } else {
      const resultIOS = await check(PERMISSIONS.IOS.CONTACTS);
      console.log(resultIOS, `step 1`);
      switch (resultIOS) {
        case RESULTS.GRANTED:
          return true;
        default: {
          const granted = await request(PERMISSIONS.IOS.CONTACTS);
          console.log(granted, `step 2`);
          if (granted === RESULTS.BLOCKED || granted === RESULTS.UNAVAILABLE) {
            fnGoToSetting('Stump would like to access to your contacts?');
          }
          return granted === RESULTS.GRANTED ? true : false;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const checkATTPermission = async () => {
  if (Platform.OS === 'ios') {
    const resultIOS = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    console.log(resultIOS, `step 1`);
  }
};
