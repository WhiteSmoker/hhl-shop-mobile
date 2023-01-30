import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, ColorValue, TouchableOpacity, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-scaling';

interface Props {
  containerStyle?: ViewStyle;
  trackColor?: {
    true: ColorValue;
    false: ColorValue;
  };
  thumbColor?: ColorValue;
  onChange(value: boolean): void;
  value: boolean;
}

const CustomSwitch = (props: Props) => {
  const animSwitch = useRef(new Animated.Value(props.value ? scale(42) : 0)).current;
  const dfStyle = useMemo(() => {
    return {
      width: scale(42),
      height: scale(26),
      borderRadius: scale(60),
    };
  }, []);

  useEffect(() => {
    Animated.timing(animSwitch, {
      useNativeDriver: false,
      toValue: props.value ? scale(42) : 0,
      duration: 100,
    }).start();
  }, [animSwitch, props.value]);

  const toggleValue = () => {
    props.onChange(!props.value);
  };

  const translateX = animSwitch.interpolate({
    inputRange: [0, scale(42)],
    outputRange: [scale(3), scale(19)],
  });
  const backgroundColor = animSwitch.interpolate({
    inputRange: [0, scale(42)],
    outputRange: [props.trackColor?.false?.toString() || '#d3d3d3', props.trackColor?.true?.toString() || '#55acee'],
  });

  return (
    <TouchableOpacity activeOpacity={1} onPress={toggleValue}>
      <Animated.View style={{ ...dfStyle, ...props.containerStyle, backgroundColor }}>
        <Animated.View style={{ transform: [{ translateX }], marginVertical: scale(3) }}>
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              width: scale(20),
              height: scale(20),
              borderRadius: 100,
              backgroundColor: props.thumbColor || '#ffffff',
            }}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default memo(CustomSwitch);
