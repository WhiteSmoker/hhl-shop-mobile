import { IconBin, IconPencil, IconReportFlag, IconUnShare } from '@/assets/icons/Icon';
import { APP_NAVIGATION, HOME_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { stumpController } from '@/controllers';
import { chatController } from '@/controllers/chat.controller';
import { conversationController } from '@/controllers/conversation.controller';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { navigationRef } from '@/navigators/refs';
import { Stump, useAppDispatch } from '@/stores';
import { chatSlice, stumpSlice } from '@/stores/reducers';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { IRoomChat } from '@/stores/types/chat.type';
import { Conversation } from '@/stores/types/record.type';
import { Colors } from '@/theme/colors';
import { promptHelper } from '@/utils/helper';
import React, { useCallback, useImperativeHandle, useRef } from 'react';
import { Animated, I18nManager, Text, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-scaling';
import Toast from 'react-native-toast-message';
import { TextComponent } from '../TextComponent';
import styles from './styles';
export interface IProps {
  children: React.ReactNode;
  data: Stump | Conversation | IRoomChat;
  myId?: number;
  type?: 'stump' | 'conversation';
  typeScreen?: 'draft' | 'schedule' | 'stump';
  editable?: boolean;
  screen?: string;
  functionType?: 'message' | 'conversation';
}
const SwipeableComponent = ({ functionType = 'conversation', ...props }: IProps, ref: any) => {
  const dispatch = useAppDispatch();
  const _swipeableRow = useRef<Swipeable>(null);

  const pressHandlerDelete = React.useCallback(async () => {
    try {
      let message = '';
      switch (props.typeScreen) {
        case 'draft': {
          message = 'This will permanently delete this draft.';
          break;
        }
        case 'schedule': {
          message = 'This will permanently delete this scheduled stump.';
          break;
        }
        default: {
          message = 'This will permanently delete your Stump.';
          break;
        }
      }
      await promptHelper('Are you sure?', message, 'Cancel', 'Delete');
      globalLoading(true);
      close();

      if (props.type === 'conversation') {
        emitter(EDeviceEmitter.DELETE_CONVERSATION, props.data.id);
        await conversationController.removeConversation(props.data.id);
        dispatch(getNumberConversation());
        Toast.show({
          text1: 'Stump',
          text2: `Your conversation was deleted.`,
          type: 'success',
        });
      } else {
        dispatch(stumpSlice.actions.setDeleteStump(props.data.id));
        await stumpController.removeStump(props.data.id);
        Toast.show({
          text1: 'Stump',
          text2: `Your stump was deleted.`,
          type: 'success',
        });
        //+/- count created
        const data = props.data as Stump;
        // dispatch(decreaseCountStump('created'));
        // +/- count liked
        const arrIndex = data.reactions!.rows.findIndex(row => row.userId === props.myId && row.type);
        if (arrIndex !== -1) {
          // dispatch(decreaseCountStump('liked'));
        }
        // +/- count shared
        const indexShared = data.userShared?.findIndex(id => id === props.myId);

        if (typeof indexShared === 'number' && indexShared !== -1) {
          // dispatch(decreaseCountStump('restumped'));
        }
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
      close();
    }
  }, [dispatch, props.data, props.myId, props.type, props.typeScreen]);

  const pressHandlerEdit = React.useCallback(() => {
    try {
      close();
      const data = props.data as Stump;
      navigationRef?.current?.navigate(APP_NAVIGATION.HOME, {
        screen: HOME_NAVIGATION.EDIT_STUMP,
        initial: false,
        params: {
          title: data?.title || '',
          tag: data?.listStump || [],
          description: data?.description || '',
          stumpDetail: { ...data, screen: props.screen },
          mode: 'Edit',
        },
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [props.data, props.screen]);

  const pressHandlerUnshare = React.useCallback(async () => {
    try {
      await promptHelper('Are you sure?', `Are you sure that you want to unshare it.`, 'Cancel', 'Unshare');
      globalLoading(true);
      close();
      const res_unshare = await stumpController.unShareStump((props.data as Stump).id);
      if (res_unshare.status === 1) {
        emitter(EDeviceEmitter.FETCH_SHARED_TAB_PROFILE);
        emitter(EDeviceEmitter.FETCH_SHARED_TAB_OTHER_PROFILE);
        emitter(EDeviceEmitter.UPDATE_NUMBER_UNSHARE_HOME, { id: (props.data as Stump).id, userId: props.myId });
        emitter(EDeviceEmitter.UPDATE_NUMBER_UNSHARE_PROFILE, { id: (props.data as Stump).id, userId: props.myId });
        emitter(EDeviceEmitter.UPDATE_NUMBER_UNSHARE_OTHER_PROFILE, {
          id: (props.data as Stump).id,
          userId: props.myId,
        });
        // dispatch(unShareStumpHome({ id: (props.data as Stump).id, userId: props.myId }));
        // dispatch(unShareStumpSearch({ id: (props.data as Stump).id, userId: props.myId }));
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
      close();
    }
  }, [dispatch, props.data, props.myId]);

  const pressHandlerReport = React.useCallback(() => {
    close();
    emitter(EDeviceEmitter.MODAL_REPORT, (props.data as Stump).id);
  }, [props.data]);

  const renderAction = React.useCallback(
    (text: string, color: string, x: number, progress: Animated.AnimatedInterpolation<number>) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
      });

      const pressHandler = async () => {
        if (text === 'Delete') {
          await pressHandlerDelete();
        }
        if (text === 'Edit') {
          pressHandlerEdit();
        }
        if (text === 'Unshare') {
          pressHandlerUnshare();
        }
        if (text === 'Report') {
          pressHandlerReport();
        }
      };
      return (
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton
            style={[styles.rightAction, { backgroundColor: 'transparent' }]}
            onPress={pressHandler}
            activeOpacity={1}>
            {text === 'Delete' && <IconBin fill={Colors.red} width={scale(28)} height={scale(28)} />}
            {text === 'Edit' && <IconPencil fill={Colors.red} width={scale(28)} height={scale(28)} />}
            {text === 'Unshare' && <IconUnShare fill={Colors.red} width={scale(28)} height={scale(28)} />}
            {text === 'Report' && <IconReportFlag fill={Colors.red} width={scale(28)} height={scale(28)} />}
            <TextComponent style={styles.actionText}>{text}</TextComponent>
          </RectButton>
        </Animated.View>
      );
    },
    [pressHandlerDelete, pressHandlerEdit, pressHandlerReport, pressHandlerUnshare],
  );

  const pressHandlerMessageDelete = React.useCallback(async () => {
    try {
      await promptHelper('Are you sure?', 'This will permanently delete your Message', 'Cancel', 'Delete');
      globalLoading(true);
      close();
      await chatController.archiveRoomRequest(props.data.id);
      dispatch(chatSlice.actions.deleteRoom(props.data.id));
      Toast.show({
        text1: 'Message',
        text2: `Your message was deleted.`,
        type: 'success',
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [dispatch, props.data?.id]);

  const renderMessageAction = React.useCallback(
    (text: string, _color: string, x: number, progress: Animated.AnimatedInterpolation<number>) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
      });

      const pressHandler = async () => {
        if (text === 'Delete') {
          await pressHandlerMessageDelete();
        }
      };
      return (
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton
            style={[styles.rightAction, { backgroundColor: 'transparent' }]}
            onPress={pressHandler}
            activeOpacity={1}>
            {text === 'Delete' && <IconBin fill={Colors.red} width={scale(28)} height={scale(28)} />}
            <TextComponent style={styles.actionText}>{text}</TextComponent>
          </RectButton>
        </Animated.View>
      );
    },
    [],
  );

  const renderRightActions = React.useCallback(
    (progress: Animated.AnimatedInterpolation<number>) => {
      return (
        <View
          style={{
            maxWidth: scale(200),
            minWidth: scale(150),
            height: scale(112),
            flex: 1,
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          {props.myId === props.data.hostId ? (
            <>
              {renderAction('Delete', Colors.Pure_Orange, scale(80), progress)}
              {props.editable ? renderAction('Edit', Colors.Pure_Orange, scale(80), progress) : null}
            </>
          ) : (
            <>
              {(props.data as Stump).userShared?.includes(props.myId)
                ? renderAction('Unshare', Colors.Pure_Orange, scale(80), progress)
                : null}
              {props.type === 'stump' ? renderAction('Report', Colors.Pure_Orange, scale(80), progress) : null}
            </>
          )}
        </View>
      );
    },
    [props.data, props.editable, props.myId, props.type, renderAction],
  );

  const renderRightMessageActions = React.useCallback(
    (progress: Animated.AnimatedInterpolation<number>) => {
      return (
        <View
          style={{
            width: scale(150),
            height: scale(112),
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          {renderMessageAction('Delete', Colors.Pure_Orange, scale(80), progress)}
        </View>
      );
    },
    [renderMessageAction],
  );

  const close = () => {
    _swipeableRow?.current?.close();
  };

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        _swipeableRow?.current?.openRight();
      },
    }),
    [],
  );

  const SwitchFunctionRenderActions = useCallback(
    (progressAnimatedValue: any) => {
      if (functionType === 'message') {
        return renderRightMessageActions(progressAnimatedValue);
      }
      return renderRightActions(progressAnimatedValue);
    },
    [functionType, renderRightActions, renderRightMessageActions],
  );

  return (
    <Swipeable
      ref={_swipeableRow}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={SwitchFunctionRenderActions}>
      {props.children}
    </Swipeable>
  );
};
export default React.memo(React.forwardRef(SwipeableComponent));
