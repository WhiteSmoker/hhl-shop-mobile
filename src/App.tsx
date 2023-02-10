import React from 'react';
import { Platform, StatusBar, StyleSheet, UIManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import KeepAwake from 'react-native-keep-awake';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import Loading from './containers/components/Loading';
import { Colors } from './theme/colors';
import { store } from './stores';
import { typography } from './theme';

import { RootNavigator } from '@/navigators';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const App = () => {
  typography();
  React.useEffect(() => {
    KeepAwake.activate();
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
        <KeepAwake />
        <StatusBar translucent={false} backgroundColor={Colors.Soft_Blue} />
        <RootNavigator />
        <Loading />
        <Toast />
      </GestureHandlerRootView>
    </Provider>
  );
};
