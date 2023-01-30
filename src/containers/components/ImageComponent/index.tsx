import React from 'react';
import FastImage from 'react-native-fast-image';
import UserIconSvg from '@/assets/icons/user_icon.svg';
import { Animated } from 'react-native';

interface IProps {
  uri: string;
  borderRadius: number;
  width: number | string;
  height: number;
  style?: any;
}
export const ImageComponent = React.memo(({ uri, width, height, borderRadius = 0, style = {} }: IProps) => {
  const opacity = React.useRef(new Animated.Value(1)).current;

  const finalStyle = React.useMemo(
    () => ({
      ...style,
      borderRadius,
      width,
      height,
    }),
    [height, borderRadius, style, width],
  );
  const source = React.useMemo(() => ({ uri }), [uri]);

  const onLoadEnd = React.useCallback(() => {
    Animated.timing(opacity, { duration: 100, toValue: 0, useNativeDriver: true }).start();
  }, [opacity]);

  return uri ? (
    <FastImage source={source} style={finalStyle} onLoadEnd={onLoadEnd} />
  ) : (
    <UserIconSvg width={width} height={height} />
  );
});
