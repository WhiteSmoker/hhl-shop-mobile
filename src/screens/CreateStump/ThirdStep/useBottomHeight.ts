import { percentHeight, scale } from '@/theme/scale';
import { useCallback, useState } from 'react';

const useBottomHeight = () => {
  const [bottomHeight, setBottomHeight] = useState(0);
  const handleFocus = useCallback(
    (field: 'email' | 'phoneNumber' | 'message') => () => {
      if (field === 'email') {
        setBottomHeight(percentHeight(0.42));
      }
      if (field === 'phoneNumber') {
        setBottomHeight(percentHeight(0.42));
      }
      if (field === 'message') {
        setBottomHeight(scale(100));
      }
    },
    [],
  );
  return { bottomHeight, handleFocus };
};

export default useBottomHeight;
