import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { Alert, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { userController } from '@/controllers';
import RNFetchBlob from 'rn-fetch-blob';
import { authController } from '../controllers/auth.controller';
import { providerController } from '@/controllers/provider.controller';

export const validFindIndex = (index: number | undefined) => index !== -1 && index !== undefined;

export const getTypeMessage = (mimeType: string) => {
  if (validFindIndex(mimeType.indexOf('video'))) {
    return 'video';
  }
  if (validFindIndex(mimeType.indexOf('image'))) {
    return 'image';
  }
  return 'text';
};

export const getType = (mimeType: string) => {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'video/mp4':
      return '.mp4';
    case 'application/pdf':
      return '.pdf';
    default:
      return '.png';
  }
};

export const getTokenFCM = async () => {
  const defaultMess = firebase.messaging();
  const enabled = await firebase.messaging().hasPermission();
  return enabled ? defaultMess.getToken() : null;
};

export const getDeviceInfo = async () => {
  const uuid = await DeviceInfo.getUniqueId();
  return { deviceType: Platform.OS === 'ios' ? 1 : 0, uuid };
};

export const checkPermissionFCM = async (firstLogin?: boolean) => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const deviceToken = await getTokenFCM();
      const { deviceType, uuid } = await getDeviceInfo();
      await authController.addDevice({
        deviceType,
        deviceToken,
        uuid,
        firstLogin,
        timezone: new Date().getTimezoneOffset(),
      });
    }
  } catch (e) {
    console.error(e);
  }
};

export const _checkExistEmail = async (email: string) => {
  try {
    const response = await userController.findUser(email);
    if (response.status === 1) {
      return response.data?.length ? response.data[0] : false;
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const _uploadPresignedUrl = async (data: any) => {
  try {
    const res_presignedLink = await providerController.getPresignedUrl(data.filename);

    await RNFetchBlob.fetch(
      'PUT',
      `${res_presignedLink.data.url}`,
      {
        // Authorization : "Bearer access-token",
        'Content-Type': undefined as unknown as any,
      },
      data.data,
    ).uploadProgress((written: any, total: any) => {
      console.log('uploaded', written / total, `userId`);
    });
    return { url: res_presignedLink.data.url.split('?')[0], fileType: data.type };
  } catch (error: any) {
    console.log(error, `err RNFetchBlob`);
  }
};

export const replaceRangeHelper = (str: string, start: number, end: number, substitute: string) =>
  str.substring(0, start) + substitute + str.substring(end);

export const getElementDiffArr = (newArr: string[], oldArr: string[]) => {
  let indexDiff;
  if (!newArr.length) {
    return '';
  }
  if (!oldArr.length) {
    return newArr[0];
  }
  if (newArr.length === 1 && oldArr.length === 1) {
    return newArr[0];
  }
  for (const i in newArr) {
    if (newArr[i] !== oldArr[i]) {
      indexDiff = Number(i);
      break;
    }
  }
  return typeof indexDiff === 'number' ? newArr[indexDiff] : '';
};

export const combineInterleaveArray = ([x, ...xs]: any, ys: any = []): any => {
  return x === undefined ? ys : [x, ...combineInterleaveArray(ys, xs)];
};

export const randomCode = (length: number) => {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('').toLowerCase();
};

export const promptHelper = (title: string, message: string, textCancel = 'Cancel', textOk = 'OK') => {
  return new Promise<boolean>((resolve, reject) => {
    Alert.alert(title, message, [
      {
        text: textCancel,
        onPress: () => {
          reject(false);
        },
      },
      {
        text: textOk,
        onPress: () => {
          resolve(true);
        },
      },
    ]);
  });
};
