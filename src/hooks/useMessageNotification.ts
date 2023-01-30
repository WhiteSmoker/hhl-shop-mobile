import { APP_NAVIGATION, HOME_NAVIGATION, NOTIFICATION_NAVIGATION, TYPE_NOTIFICATION } from '@/constants';
import { navigationRef } from '@/navigators/refs';
import { IUserInfo, useAppDispatch } from '@/stores';
import { counterSlice } from '@/stores/reducers';
import { fetchListRoom } from '@/stores/thunks/chat.thunk';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useAuth } from './useAuth';
import { EDeviceEmitter, emitter } from './useEmitter';

const useMessageNotification = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAuth();
  useEffect(() => {
    if (!userInfo) {
      return;
    }
    const listenerOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      handlerOpenedApp(remoteMessage, userInfo);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          handlerOpenedApp(remoteMessage, userInfo);
        }
      });

    return () => {
      listenerOpenedApp();
    };
  }, [userInfo]);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      const { data }: any = remoteMessage.data;
      const noti = data && JSON.parse(data);
      if (noti?.type !== TYPE_NOTIFICATION.SEND_MESSAGE) {
        dispatch(counterSlice.actions.setCountNewNotification(1));
        emitter(EDeviceEmitter.FETCH_DATA_NOTIFICATION);
      } else {
        dispatch(fetchListRoom({}));
      }
    });
  }, []);

  useEffect(() => {
    const notificationListener = messaging().onMessage(message => {
      console.log(message, `onMessage`);

      Toast.show({
        text1: 'Stump',
        text2: message.notification?.body,
        type: 'success',
      });
      if (JSON.parse(message.data?.data || '{}')?.type !== TYPE_NOTIFICATION.SEND_MESSAGE) {
        dispatch(counterSlice.actions.setCountNewNotification(1));
      }
    });
    return () => {
      notificationListener();
    };
  }, []);

  //handle click notification
  const handlerOpenedApp = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage, user?: IUserInfo) => {
    try {
      const { data }: any = remoteMessage.data;
      const noti = data && JSON.parse(data);
      if (noti?.type !== TYPE_NOTIFICATION.SEND_MESSAGE) {
        dispatch(counterSlice.actions.setCountNewNotification(1));
      }

      switch (noti?.type) {
        case TYPE_NOTIFICATION.REMIND_CONVERSATION: {
          navigationRef?.current?.navigate(APP_NAVIGATION.HOME, {
            screen: HOME_NAVIGATION.SCHEDULEDHOME,
            initial: false,
            params: { tab: user?.id === noti?.hostId ? 'schedule' : 'scheduleParticipatedIn' },
          });
          break;
        }
        case TYPE_NOTIFICATION.SEND_MESSAGE: {
          dispatch(fetchListRoom({}));
          break;
        }
        default: {
          navigationRef?.current?.navigate(APP_NAVIGATION.NOTIFICATION, {
            screen: NOTIFICATION_NAVIGATION.NOTIFICATION,
            initial: false,
          });
          break;
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };
};

export default useMessageNotification;
