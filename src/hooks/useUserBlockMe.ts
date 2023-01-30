import React from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';

export const useUserBlockMe = () => {
  const userInfo = useAuth();
  const isBlockMe = React.useCallback(
    (userId: number) => {
      const userBlockMe = (userInfo?.blockedBy || []).map(u => u.id);
      if (userBlockMe.includes(userId)) {
        Alert.alert('', `You are blocked by this user`);
        throw new Error('useUserBlockMe');
      }
      return userBlockMe.includes(userId);
    },
    [userInfo?.blockedBy],
  );

  return { isBlockMe };
};
