import { useMemo } from 'react';
import { IUserInfo, selectUserInfo, useAppSelector } from '@/stores';
export const useAuth = (): IUserInfo => {
  const userInfo = useAppSelector(selectUserInfo);
  return useMemo(() => userInfo!, [userInfo]);
};
