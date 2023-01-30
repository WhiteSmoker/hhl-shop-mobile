import { TRootState } from '..';

export const selectTabActive = (state: TRootState) => state.commonState.tabActive;
