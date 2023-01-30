import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import csStyles from './styles';
import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';

const Loading = () => {
  const [isLoading, setLoading] = useState(false);
  useEmitter(EDeviceEmitter.GLOBAL_LOADING, (bool: boolean) => {
    setLoading(bool);
  });

  return isLoading ? (
    <View style={csStyles.view_loading}>
      <View style={csStyles.viewContent}>
        <LottieView
          source={require('@/assets/json/loading.json')}
          autoPlay={true}
          loop={true}
          style={csStyles.loading}
        />
      </View>
    </View>
  ) : null;
};

export default Loading;
