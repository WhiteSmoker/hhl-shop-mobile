import React from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
const _dismissKeyboard = () => {
  Keyboard.dismiss();
};
const DismissKeyboard = ({ children }: any) => (
  <TouchableWithoutFeedback accessible={false} onPress={_dismissKeyboard}>
    {children}
  </TouchableWithoutFeedback>
);

export default DismissKeyboard;
