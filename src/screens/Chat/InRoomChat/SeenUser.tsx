import { styles } from './styles';
import React from 'react';
import { Animated } from 'react-native';
import { ImageComponent } from '@/containers/components/ImageComponent';
import { scale } from 'react-native-size-scaling';

export const SeenUser = React.memo(({ avatar }: { avatar: string }) => {
  const ani = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  React.useEffect(() => {
    Animated.timing(ani, { duration: 200, toValue: { x: 1, y: 1 }, useNativeDriver: true }).start();
  }, [ani]);
  const style = {
    opacity: ani.x?.interpolate({
      inputRange: [0, 0.5],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateX: ani.x?.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [scale(-3), scale(-2.5), 0],
          extrapolate: 'clamp',
        }),
      },
      {
        translateY: ani.y?.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [scale(-3), scale(-2), 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
  return (
    <Animated.View style={style}>
      <ImageComponent
        uri={(avatar as string) || ''}
        width={scale(15)}
        height={scale(15)}
        borderRadius={scale(15)}
        style={styles.avtSeenUser}
      />
    </Animated.View>
  );
});
