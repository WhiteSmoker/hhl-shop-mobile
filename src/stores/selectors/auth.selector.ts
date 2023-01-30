import { TRootState } from '..';

export const selectAuth = (state: TRootState) => state.authState.user;
