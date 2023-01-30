import { APP_NAVIGATION, CONVERSATION_STATUS } from '@/constants';
import { useAppSelector } from '@/stores';

const usePreventPlayAudio = () => {
  const { joinStatus, tabActive, roomDetail } = useAppSelector(rootState => ({
    joinStatus: rootState.recordState.joinStatus,
    tabActive: rootState.commonState.tabActive,
    roomDetail: rootState.recordState.roomDetail,
  }));

  return {
    isPrevent:
      (roomDetail?.status === CONVERSATION_STATUS.SCHEDULED ||
        roomDetail?.status === CONVERSATION_STATUS.RECORDING ||
        roomDetail?.status === CONVERSATION_STATUS.PAUSED) &&
      joinStatus &&
      tabActive !== APP_NAVIGATION.CREATE,
  };
};

export default usePreventPlayAudio;
