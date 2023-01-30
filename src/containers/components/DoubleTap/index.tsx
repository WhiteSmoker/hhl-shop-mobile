import React from 'react';
import { TouchableOpacity } from 'react-native';

interface Props {
  children: any;
  onPress?: () => void;
  onDoubleTap: () => void;
  onLongPress: () => void;
  delay?: number;
  style?: any;
}
export const DoubleTap = React.memo(
  ({ children, onPress, onDoubleTap, onLongPress, delay = 350, style = {} }: Props) => {
    const lastTap = React.useRef(0);
    const timeout = React.useRef<number>();
    const handlePress = () => {
      const now = Date.now();
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (onPress) {
        timeout.current = setTimeout(() => {
          onPress();
        }, delay);
      }
      if (lastTap.current && now - lastTap.current < delay) {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
        onDoubleTap();
      } else {
        lastTap.current = now;
      }
    };
    return (
      <TouchableOpacity onPress={handlePress} onLongPress={onLongPress} style={style} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  },
);
DoubleTap.displayName = 'Components/DoubleTap';
