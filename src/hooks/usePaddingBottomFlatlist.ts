import { useAppSelector } from '@/stores';
import { commonStyles } from '@/styles/common';
import { useMemo } from 'react';
import usePreventPlayAudio from './usePreventPlayAudio';
import { useIsRecording } from './useIsRecording';

export const usePaddingBottomFlatlist = () => {
  const stumpActive = useAppSelector(rootState => rootState.commonState.stumpActive);
  const { isPrevent } = usePreventPlayAudio();
  const isRecording = useIsRecording();

  return useMemo(() => {
    if (isRecording) {
      return commonStyles.paddingLastItem;
    }
    if (!stumpActive && !isPrevent) {
      return commonStyles.p_b_0;
    }
    return commonStyles.paddingLastItem;
  }, [isPrevent, isRecording, stumpActive]);
};
