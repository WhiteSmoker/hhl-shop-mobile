import { ASYNC_STORE, storage } from '@/storage';
import React from 'react';

export const useGetMyId = () => {
  const [myId, setMyId] = React.useState(0);
  React.useEffect(() => {
    storage.getItem(ASYNC_STORE.MY_USER_ID).then(val => {
      if (val) {
        setMyId(Number(val));
      }
    });
  }, []);
  return myId;
};
