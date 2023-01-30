import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { scale } from './scale';

// export const typography = StyleSheet.create({
//   title: {
//     fontSize: scale(18),
//     fontWeight: '700',
//   },
//   text: {
//     fontSize: scale(16),
//     fontWeight: '400',
//   },
//   label: {
//     fontSize: scale(16),
//     fontWeight: '700',
//   },
//   error: {
//     fontSize: scale(14),
//     fontWeight: '400',
//   },
// });

export const typography = () => {
  const oldTextRender = (Text as any).render;

  (Text as any).render = (...args: any) => {
    const origin = oldTextRender.call(this, ...args);

    return React.cloneElement(origin, {
      style: [styles.defaultText, origin.props.style],
    });
  };
};
const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Lexend-Regular',
  },
});
