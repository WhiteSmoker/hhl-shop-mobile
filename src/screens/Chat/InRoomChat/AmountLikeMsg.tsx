import React from 'react';
import { Animated, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import { IAmountLikeMsgProps } from '@/stores/types/chat.type';
import { TextComponent } from '@/containers/components/TextComponent';

export const AmountLikeMsg = React.memo(({ position, likedBy }: IAmountLikeMsgProps) => {
  const ani = React.useRef(new Animated.Value(0)).current;
  const firstLike = React.useRef(likedBy.length || 0);
  React.useEffect(() => {
    if (firstLike.current) {
      return;
    }
    Animated.timing(ani, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [ani, likedBy]);

  const stylePosition: any = React.useMemo(() => {
    const common = {
      position: 'absolute',
      zIndex: 1,
      minWidth: scale(18),
      padding: scale(2),
      backgroundColor: Colors.Light_Gray,
      borderRadius: scale(18),
      borderWidth: scale(2),
      borderColor: Colors.white,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [
        {
          scale: ani.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, scale(1.2), 1],
            extrapolate: 'clamp',
          }),
        },
        {
          rotate: ani.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '-30deg', '0deg'],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
    return position === 'right'
      ? {
          ...common,
          bottom: scale(-8),
          right: scale(4),
        }
      : {
          ...common,
          bottom: scale(-8),
          left: scale(-4),
        };
  }, [ani, position]);

  return likedBy.length ? (
    <Animated.View style={stylePosition}>
      <Icon name="heart" color={Colors.Vivid_red} size={scale(13)} />
      {likedBy.length > 1 && <TextComponent style={{ fontSize: scale(10) }}>{likedBy.length}</TextComponent>}
    </Animated.View>
  ) : null;
});

AmountLikeMsg.displayName = 'ChatScreen/AmountLikeMsg';
