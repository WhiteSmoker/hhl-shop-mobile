import React from 'react';
import { View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-scaling';

interface Props {
  color?: any;
  width: any;
  height?: any;
  marginTop?: number;
  style?: ViewStyle;
}

const HorizontalRuleComponent = ({ color, width, height, marginTop = 0, style = {} }: Props) => {
  return (
    <View
      style={{
        backgroundColor: color,
        width: width,
        height: height,
        marginTop: scale(marginTop),
        ...style,
      }}
    />
  );
};

export default React.memo(HorizontalRuleComponent);
