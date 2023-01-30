import { APP_NAVIGATION, CONVERSATION_STATUS } from '@/constants';
import { useAppSelector } from '@/stores';

export const useIsRecording = (): boolean => {
  const { roomDetail, joinStatus } = useAppSelector(rootState => ({
    roomDetail: rootState.recordState.roomDetail,
    joinStatus: rootState.recordState.joinStatus,
  }));
  const tabActive = useAppSelector(rootState => rootState.commonState.tabActive);
  return (
    (roomDetail?.status === CONVERSATION_STATUS.SCHEDULED ||
      roomDetail?.status === CONVERSATION_STATUS.RECORDING ||
      roomDetail?.status === CONVERSATION_STATUS.PAUSED) &&
    joinStatus &&
    tabActive !== APP_NAVIGATION.CREATE
  );
};
