import React from 'react';
import { Platform, StatusBar, StyleSheet, UIManager } from 'react-native';
import { RootNavigator } from '@/navigators';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import KeepAwake from 'react-native-keep-awake';
import Loading from './containers/components/Loading';
import ShareModal from './containers/components/ShareModal';
import Toast from 'react-native-toast-message';
import { Colors } from './theme/colors';
import { store } from './stores';
import Listening from './screens/Listening';
import ChooseFileModal from './containers/components/ChooseFileModal';
import { chooseFileModalRef, shareModalRef } from './refs';
import BannerInCall from './containers/components/BannerInCall';
import { typography } from './theme';

import ModalReceiveInvitation from './containers/components/ModalReceiveInvitation';
import ReportComponent from './containers/components/ReportComponent';
import ModalAds from './containers/components/ModalAds';
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
        <BannerInCall />
        <Loading />
        <Toast />
        <Listening />
        <ShareModal ref={shareModalRef} />
        <ChooseFileModal ref={chooseFileModalRef} />
        <ModalAds />
        <ReportComponent />
        <ModalReceiveInvitation />
      </GestureHandlerRootView>
    </Provider>
  );
};
