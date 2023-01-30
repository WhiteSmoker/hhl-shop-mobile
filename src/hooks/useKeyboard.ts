import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboard = () => {
  const [state, setState] = useState<{ status: boolean; height: number }>({ status: false, height: 0 });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setState({ status: true, height: e?.endCoordinates?.height || 0 });
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setState({ status: false, height: 0 });
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return state;
};
export default useKeyboard;
