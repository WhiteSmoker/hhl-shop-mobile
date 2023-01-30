import { Dimensions, Platform } from 'react-native';
import { scale } from 'react-native-size-scaling';

/** Check device IOS has notch */
export const isNotchIphone = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
};

export const ifNotchIphone = (iphoneXStyle: any, regularStyle: any) => {
  if (isNotchIphone()) {
    return iphoneXStyle;
  }
  return regularStyle;
};

export const percentHeight = (percent: number) => {
  const dimen = Dimensions.get('window');
  let percentPlatform = percent;
  if (Platform.OS === 'ios') {
    percentPlatform =
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926
        ? percent + 0.1
        : percent + 0.3;
  }

  if (dimen.height * dimen.scale < 1800) {
    return 0.7 * percentPlatform * dimen.height;
  }
  return percentPlatform * dimen.height;
};

export { scale };
