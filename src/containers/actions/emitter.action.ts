import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';

export const globalLoading = (value: boolean | null = false, canLoading = true) => {
  if (!canLoading) {
    return;
  }
  emitter(EDeviceEmitter.GLOBAL_LOADING, !!value);
};
