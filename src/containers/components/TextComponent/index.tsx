import React from 'react';

import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

interface ITextComponentProps extends TextProps {
  children: any;

  style?: any;
}

export const TextComponent: React.FC<ITextComponentProps> = ({ children, style, ...rest }) => {
  return (
    <Text {...rest} style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Lexend-Regular',
  },
});

React.memo(TextComponent);
