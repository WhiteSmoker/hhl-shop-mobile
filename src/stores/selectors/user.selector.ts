import { TRootState } from '..';

export const selectUserInfo = (state: TRootState) => state.userState.userInfo;
