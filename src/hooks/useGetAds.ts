import { globalLoading } from '@/containers/actions/emitter.action';
import { stumpController } from '@/controllers';
import { useAppDispatch } from '@/stores';
import { commonSlice, stumpSlice } from '@/stores/reducers';
import React from 'react';

export const useGetAds = () => {
  const dispatch = useAppDispatch();

  const getRandomAds = React.useCallback(async () => {
    try {
      globalLoading(true);
      const res = await stumpController.getRamdomAds();
      dispatch(stumpSlice.actions.setStumpAds(res.data));
      dispatch(commonSlice.actions.setCountPlayStump(2));
    } catch (error) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [dispatch]);

  return { getRandomAds };
};
