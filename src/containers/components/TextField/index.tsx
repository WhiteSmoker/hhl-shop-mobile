import React, { useImperativeHandle } from 'react';
import { Animated, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-scaling';

export interface ITextFieldProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
}

export interface ITextFieldRef {
  getValue(): string;
}
export const TextField = React.memo(
  React.forwardRef<ITextFieldRef, ITextFieldProps>(({ label, containerStyle, onChangeText, ...rest }, ref) => {
    const value = React.useRef('');
    const ani = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      value.current = rest.defaultValue || '';
    }, [rest.defaultValue]);

    const _onChangeText = React.useCallback(
      (text: string) => {
        value.current = text;
        if (onChangeText) {
          onChangeText(text);
        }
      },
      [onChangeText],
    );

    const onFocus = React.useCallback(() => {
      if (!label) {
        return;
      }
      if (value.current) {
        return;
      }
      Animated.spring(ani, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }, [ani, label]);

    const onBlur = React.useCallback(() => {
      if (value.current) {
        return;
      }
      if (!label) {
        return;
      }

      Animated.spring(ani, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }, [ani, label]);

    const finalContainerStyle = React.useMemo(() => containerStyle || {}, [containerStyle]);

    useImperativeHandle(
      ref,
      () => {
        return {
          getValue: () => value.current,
        };
      },
      [],
    );

    return (
      <View style={finalContainerStyle}>
        <View style={[styles.input]}>
          <TextInput
            style={[styles.textInput]}
            {...rest}
            //   placeholder="Name"
            onChangeText={_onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <Animated.View
            style={[
              styles.labelContainer,
              {
                transform: [
                  {
                    translateY: ani.interpolate({
                      inputRange: [0, 1],
                      outputRange: [scale(25), 0],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    scale: ani.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            {label && <Text style={styles.label}>{label}</Text>}
          </Animated.View>
        </View>
      </View>
    );
  }),
);

const styles = StyleSheet.create({
  input: {
    borderColor: '#B9C4CA',
    borderWidth: scale(1),
    borderRadius: scale(6),
    height: scale(50),
  },
  textInput: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
    height: scale(50),
    fontSize: scale(14),
  },
  labelContainer: {
    position: 'absolute',
    left: scale(6),
    top: scale(-11),
    paddingHorizontal: scale(8),
    backgroundColor: 'white',
  },
  label: {
    fontSize: scale(16),
    lineHeight: scale(22),
    fontWeight: 'bold',
  },
});
