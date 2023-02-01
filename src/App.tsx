import { RootNavigator } from '@/navigators';
import React from 'react';
import { Platform, StatusBar, StyleSheet, UIManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import KeepAwake from 'react-native-keep-awake';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import Loading from './containers/components/Loading';
import { store } from './stores';
import { typography } from './theme';

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
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <RootNavigator />
        <Loading />
        <Toast />
      </GestureHandlerRootView>
    </Provider>
  );
};
