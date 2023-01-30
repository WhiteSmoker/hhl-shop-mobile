import { useIsFocused } from '@react-navigation/native';
import {
  APP_NAVIGATION,
  CHAT_NAVIGATION,
  COMMENT_NAVIGATION,
  CONVERSATION_STATUS,
  HOME_NAVIGATION,
  NOTIFICATION_NAVIGATION,
  PARTICIPANT_STATUS,
  PROFILE_NAVIGATION,
  RECORD_NAVIGATION,
  ROOT_ROUTES,
  SCHEDULE_MODE,
  STATUS_NOTIFICATION,
  TYPE_NOTIFICATION,
} from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';

import { format } from 'date-fns';
import unionBy from 'lodash/unionBy';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Platform, RefreshControl, Switch, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { CardNotification } from './CardNotification';
import { IProps, IState } from './Notification.type';
import Skeleton from './Skeleton';
import { HighlightTextStyled, styles, TextEmptyStyled, ViewWrapStyled } from './Notification.style';
import { ASYNC_STORE, storage } from '@/storage';
import { notificationController } from '@/controllers/notification.controller';
import { sortNewestNotification } from '@/utils/array';
import { Participant, useAppDispatch, useAppSelector } from '@/stores';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { promptHelper } from '@/utils/helper';
import { globalLoading } from '@/containers/actions/emitter.action';
import { conversationController } from '@/controllers/conversation.controller';
import { commonSlice, counterSlice, recordSlice } from '@/stores/reducers';
import { requestMicroPermission } from '@/utils/permission';
import { stumpController } from '@/controllers';
import { commentController } from '@/controllers/comment.controller';
import { TRoomType } from '@/stores/types/chat.type';
import FooterLoadMore from '@/containers/components/FooterLoadMore';
import { Notification } from '@/stores/types/notification.type';
import { Colors } from '@/theme/colors';
import { commonStyles, ContainerStyled } from '@/styles/common';
import { usePaddingBottomFlatlist } from '@/hooks/usePaddingBottomFlatlist';
import { scale } from 'react-native-size-scaling';
import useEmitter, { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { fetchUser } from '@/stores/thunks/auth.thunk';

const NotificationComponent = (props: IProps) => {
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const userInfo = useAuth();
  const { isBlockMe } = useUserBlockMe();
  const contentContainerStyle = usePaddingBottomFlatlist();
  const countNewNotification = useAppSelector(rootState => rootState.counterState.countNewNotification);
  const roomDetail = useAppSelector(rootState => rootState.recordState.roomDetail);
  const [isToggle, setToggle] = useState(false);
  const [state, setState] = useState<IState>({
    currentPage: 1,
    maxPage: 1,
    loading: true,
    loadingMore: false,
    refreshing: false,
    lazy: true,
    showToggle: false,
    data: [],
  });
  useEffect(() => {
    storage.getItem(ASYNC_STORE.TOGGLE_HIDDEN).then(toggle => {
      if (toggle) {
        setToggle(!!Number(toggle));
      }
    });
  }, []);

  const toggleSwitch = async () => {
    await storage.setItem(ASYNC_STORE.TOGGLE_HIDDEN, !isToggle ? '1' : '0');
    setToggle(!isToggle);
  };

  useEffect(() => {
    _onInit();
  }, []);

  useEmitter(EDeviceEmitter.FETCH_DATA_NOTIFICATION, () => {
    _getPageOne();
  });

  const _onInit = async () => {
    if (countNewNotification) {
      await _readAllNoti();
    }
    await _getPageOne();
    setState(preState => ({ ...preState, lazy: false }));
  };

  useEffect(() => {
    if (state.lazy) {
      return;
    }
    if (isFocused && countNewNotification) {
      _readAllNoti();
      _getPageOne();
    }
  }, [isFocused, countNewNotification, state.lazy]);

  useEffect(() => {
    if (state.currentPage === 1) {
      return;
    }
    _getMoreNotification(state.currentPage);
  }, [state.currentPage]);

  const _readAllNoti = async () => {
    await notificationController.seeNotification(0);
    dispatch(counterSlice.actions.setCountNewNotification(0));
  };

  const _getPageOne = async () => {
    try {
      const res_all_noti = await notificationController.getAllNotification(1);
      if (res_all_noti.status === 1) {
        setState(preState => ({
          ...preState,
          currentPage: 1,
          maxPage: Math.ceil(res_all_noti.data.listNoti.count / 10),
          refreshing: false,
          loading: false,
          showToggle: !!res_all_noti.data.notiHide.length,
          data: res_all_noti.data.listNoti.rows,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const _getMoreNotification = async (pageNumber: number) => {
    try {
      const res_all_noti = await notificationController.getAllNotification(pageNumber);
      if (res_all_noti.status === 1) {
        setState(preState => ({
          ...preState,
          maxPage: Math.ceil(res_all_noti.data.listNoti.count / 10),
          loadingMore: false,
          data: sortNewestNotification([...preState.data, ...res_all_noti.data.listNoti.rows]),
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const _remindConversation = React.useCallback(
    async (notiId: number, conversationId: number, isHost: boolean) => {
      if (isHost) {
        props.navigation.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.SCHEDULEDHOME,
          params: { tab: 'schedule', screen: APP_NAVIGATION.NOTIFICATION },
        });
      } else {
        await notificationController.joinNowFromNotification(notiId, conversationId);
        props.navigation?.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.SCHEDULEDHOME,
          initial: false,
          params: { tab: '' },
        });
        dispatch(getNumberConversation());
        emitter(EDeviceEmitter.FETCH_DATA_SCHEDULE);
        setState(preState => ({
          ...preState,
          data: preState.data.map(noti => {
            if (noti.id === notiId) {
              return { ...noti, status: 3 };
            }
            return noti;
          }),
        }));
        props.navigation.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.SCHEDULEDHOME,
          initial: false,
          params: { tab: 'scheduleParticipatedIn', screen: APP_NAVIGATION.NOTIFICATION },
        });
      }
    },
    [dispatch, props.navigation],
  );

  const _hideNoti = React.useCallback(
    async (id: number, hostId: number, conversationId: number, isHide: boolean) => {
      try {
        if (isHide) {
          Toast.show({
            text1: 'Stump',
            text2: `You declined already.`,
            type: 'info',
          });
          return;
        }
        await promptHelper('Are you sure?', `Are you sure that you want to decline it.`, 'Cancel', 'Decline');
        globalLoading(true);
        const hidenoti = await notificationController.hideNotification(id, hostId, conversationId);
        if (hidenoti.status === 1) {
          Toast.show({
            text1: 'Stump',
            text2: `You declined successfully.`,
            type: 'success',
          });
          if (roomDetail && roomDetail.id === conversationId) {
            dispatch(
              recordSlice.actions.setConfig({
                roomDetail: { ...roomDetail, participants: [] },
              }),
            );
          }
          if (!state.showToggle) {
            setState(preState => ({ ...preState, showToggle: true }));
          }

          setState(preState => ({
            ...preState,
            data: preState.data.map(noti => {
              if (noti.id === id) {
                return { ...noti, isHide: true };
              } else {
                return noti;
              }
            }),
          }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        globalLoading();
      }
    },
    [dispatch, roomDetail, state.showToggle],
  );

  const _tickCheckmark = React.useCallback(
    async (notiId: number, conversationId: number, isHost: boolean) => {
      try {
        globalLoading(true);
        const res_get_detail = await conversationController.getDetailConversation(conversationId);
        if (res_get_detail.status === 1 && res_get_detail.data[0].scheduleMode === SCHEDULE_MODE.SCHEDULE) {
          _remindConversation(notiId, conversationId, isHost);
          return;
        }
        await promptHelper('Join call?', `Are you sure that you want to join the call.`, 'Cancel', 'Accept');

        globalLoading(true);
        if (res_get_detail.status === 1) {
          const data = res_get_detail.data[0];
          const participant: Participant[] = data.participants.filter(par => {
            if (par.user) {
              return par.user?.email?.toLowerCase() === userInfo?.email?.toLowerCase();
            } else {
              return par.inviteValue?.toLowerCase() === userInfo?.email?.toLowerCase();
            }
          });

          if (!participant || !participant.length) {
            Alert.alert('', 'You declined this invitation already.');
            return;
          }
          //check code active/inactive.
          if (participant?.length && participant[0].active === PARTICIPANT_STATUS.ACTIVE) {
            Alert.alert('', 'This user is already connect on another device. Only one device may join per user.');
            return;
          }
          //check conversation deleted.
          if (data.status === CONVERSATION_STATUS.ARCHIVED) {
            Alert.alert('', 'The conversation was deleted by host.');
            return;
          }

          //check conversation ended.
          if (
            data.status === CONVERSATION_STATUS.UPLOADING ||
            data.status === CONVERSATION_STATUS.PUBLISHED ||
            data.status === CONVERSATION_STATUS.FINISHED
          ) {
            Alert.alert('', 'The Stump ended.');
            return;
          }

          dispatch(
            recordSlice.actions.setConfig({
              role: isHost ? 'host' : 'participant',
              roomDetail: data,
              participantToEmit: data.participants,
              stoped: false,
              start_time: 0,
              scheduleLater: undefined,
              duration: data?.duration || 0,
            }),
          );
          Toast.show({
            type: 'success',
            text1: 'You have joined the conversation',
          });

          props.navigation.navigate(APP_NAVIGATION.CREATE, {
            screen: RECORD_NAVIGATION.RECORDING,
            initial: false,
            params: {
              conversationId,
              inviteCode: participant.length ? participant[0].inviteCode : '',
            },
          });
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        globalLoading();
      }
    },
    [_remindConversation, dispatch, props.navigation, userInfo?.email],
  );

  const _notiCreateConversation = React.useCallback(
    async (conversationId: number, notiId: number, isHost: boolean) => {
      try {
        globalLoading(true);
        const res_get_detail = await conversationController.getDetailConversation(conversationId);
        if (res_get_detail.status === 1 && res_get_detail.data[0].scheduleMode === SCHEDULE_MODE.SCHEDULE) {
          _remindConversation(notiId, conversationId, isHost);
          return;
        }
        await promptHelper('Join call?', `Are you sure that you want to join the call.`, 'Cancel', 'Accept');
        const permission = await requestMicroPermission();
        if (!permission) {
          return;
        }

        if (res_get_detail.status === 1) {
          const data = res_get_detail.data[0];
          const participant: Participant[] = data.participants.filter(par => {
            if (par.user) {
              return par.user?.email?.toLowerCase() === userInfo?.email?.toLowerCase();
            } else {
              return par.inviteValue?.toLowerCase() === userInfo?.email?.toLowerCase();
            }
          });

          if (!participant || !participant.length) {
            Alert.alert('', 'You declined this invitation already.');
            return;
          }
          //check code active/inactive.
          if (participant?.length && participant[0].active === PARTICIPANT_STATUS.ACTIVE) {
            Alert.alert('', 'This user is already connect on another device. Only one device may join per user.');
            return;
          }
          //check conversation deleted.
          if (data.status === CONVERSATION_STATUS.ARCHIVED) {
            Alert.alert('', 'The conversation was deleted by host.');
            return;
          }

          //check conversation ended.
          if (
            data.status === CONVERSATION_STATUS.UPLOADING ||
            data.status === CONVERSATION_STATUS.PUBLISHED ||
            data.status === CONVERSATION_STATUS.FINISHED
          ) {
            Alert.alert('', 'The Stump ended.');
            return;
          }
          //else navigate recording screen
          dispatch(
            recordSlice.actions.setConfig({
              role: isHost ? 'host' : 'participant',
              roomDetail: data,
              participantToEmit: data.participants,
              stoped: false,
              start_time: 0,
              scheduleLater: undefined,
              duration: data?.duration || 0,
            }),
          );
          Toast.show({
            type: 'success',
            text1: 'You have joined the conversation',
          });

          props.navigation.navigate(APP_NAVIGATION.CREATE, {
            screen: RECORD_NAVIGATION.RECORDING,
            initial: false,
            params: {
              conversationId,
              inviteCode: participant.length ? participant[0].inviteCode : '',
            },
          });
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        globalLoading();
      }
    },
    [_remindConversation, dispatch, props.navigation, userInfo?.email],
  );

  const _notiFollow = React.useCallback(
    async (userId: number | undefined) => {
      if (!userId) {
        return;
      }
      if (userId === userInfo?.id) {
        props.navigation.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
          initial: false,
        });
        return;
      }
      props.navigation.navigate(APP_NAVIGATION.PROFILE, {
        screen: PROFILE_NAVIGATION.VIEW_PROFILE,
        initial: false,
        params: { userId, screen: APP_NAVIGATION.NOTIFICATION },
      });
    },
    [props.navigation, userInfo],
  );

  const _notiLike = React.useCallback(
    async (stumpId: number) => {
      try {
        globalLoading(true);
        const res = await stumpController.getDetailStump(stumpId);
        if (res.status === 1 && res.data[0]) {
          dispatch(commonSlice.actions.setPlayStump({ ...res.data[0], screen: APP_NAVIGATION.NOTIFICATION }));
        }
      } catch (err) {
        console.log(err);
      } finally {
        globalLoading();
      }
    },
    [dispatch],
  );

  const _navigateProfile = React.useCallback(
    (id: number) => {
      try {
        if (!id) {
          return;
        }
        isBlockMe(id);
        if (id === userInfo?.id) {
          props.navigation.navigate(APP_NAVIGATION.PROFILE, {
            screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
            initial: false,
          });
          return;
        }
        props.navigation.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.VIEW_PROFILE,
          initial: false,
          params: { userId: id, screen: APP_NAVIGATION.NOTIFICATION },
        });
      } catch (error) {
        //
      }
    },
    [isBlockMe, props.navigation, userInfo?.id],
  );

  const _followBack = React.useCallback(
    async (followId: number, follow: boolean) => {
      try {
        globalLoading(true);
        const res_follow = await stumpController.followUser(userInfo.id, followId);
        if (res_follow.status === 1) {
          //   dispatch(setIdFollow({ id: followId, follow: !follow }));
          dispatch(fetchUser(false));
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        globalLoading();
      }
    },
    [dispatch, userInfo],
  );

  const _mention = React.useCallback(
    async (commentId: number, stumpId: number) => {
      try {
        const res = await commentController.getMentionedComment(commentId);
        if (res.status === 1) {
          props.navigation.navigate(ROOT_ROUTES.COMMENT, {
            screen: COMMENT_NAVIGATION.ALL_COMMENT,
            initial: false,
            params: {
              stumpId,
              screen: NOTIFICATION_NAVIGATION.NOTIFICATION,
              commentId,
              mentionedComment: res.data,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [props.navigation],
  );

  const _chat = React.useCallback(
    async (roomId: number, type: TRoomType) => {
      try {
        props.navigation.navigate(ROOT_ROUTES.CHAT, {
          screen: CHAT_NAVIGATION.IN_ROOM_CHAT,
          initial: false,
          params: {
            roomId,
            screen: NOTIFICATION_NAVIGATION.NOTIFICATION,
            type,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [props.navigation],
  );

  const renderFooter = React.useMemo(() => <FooterLoadMore loadingMore={state.loadingMore} />, [state.loadingMore]);

  const RenderNotification = React.useMemo(
    () =>
      ({ item }: { item: Notification }) => {
        switch (item.type) {
          case TYPE_NOTIFICATION.REPORT_NOTI:
          case TYPE_NOTIFICATION.SYSTEM: {
            return (
              <CardNotification
                item={item}
                showLogo={true}
                disablePressNotification={true}
                message={item?.data?.message || ''}
                createdAt={item?.createdAt}
              />
            );
          }
          case TYPE_NOTIFICATION.LIKE: {
            return (
              <CardNotification
                item={item}
                disablePressNotification={false}
                pressNotificationGetStumpId={_notiLike}
                onPressAvatar={_navigateProfile}
                user={item.data?.userInfo[0]}
                avatarChilds={item.data?.userInfo?.filter((_user, index: number) => index)}
                createdAt={item.createdAt}
                messageHasBold={item?.data?.message.trim() ?? `<b></b>`}
              />
            );
          }
          case TYPE_NOTIFICATION.FOLLOW: {
            return (
              <CardNotification
                item={item}
                disablePressNotification={false}
                createdAt={item?.createdAt}
                pressNotificationGetUserId={_notiFollow}
                user={item.data?.userInfo}
                otherAction={'follow'}
                messageHasBold={item?.data?.message.trim() ?? `<b></b>`}
                onPressNotificationFollow={_followBack}
                myInfo={userInfo}
              />
            );
          }
          case TYPE_NOTIFICATION.HIDE_NOTI: {
            return (
              <CardNotification
                item={item}
                disablePressNotification={true}
                createdAt={item?.createdAt}
                onPressAvatar={_navigateProfile}
                user={item.data?.userInfo}
                messageHasBold={item?.data?.message.trim() ?? `<b></b>`}
              />
            );
          }
          case TYPE_NOTIFICATION.RESCHEDULE:
          case TYPE_NOTIFICATION.CREATE_CONVERSATION: {
            return (
              <CardNotification
                item={item}
                disablePressNotification={item.status !== STATUS_NOTIFICATION.JOIN_NOW}
                createdAt={item?.createdAt}
                onPressNotificationCreate={_notiCreateConversation}
                user={item.data?.userInfo}
                onPressAvatar={_navigateProfile}
                otherAction={'create'}
                onPressCheckmark={_tickCheckmark}
                onPressClose={_hideNoti}
                messageHasBold={
                  item?.data?.message.trim() +
                    (item?.data?.message.trim().indexOf('wants') === -1
                      ? format(item?.data?.time ? new Date(item?.data?.time) : new Date(), ' hh:mm a, LLLL dd, yyyy')
                      : '') ?? `<b></b>`
                }
              />
            );
          }
          case TYPE_NOTIFICATION.REMIND_CONVERSATION: {
            return (
              <CardNotification
                item={item}
                createdAt={item.createdAt}
                disablePressNotification={false}
                showLogo={true}
                onPressNotificationRemind={_remindConversation}
                messageHasBold={
                  item?.data?.message.trim() +
                    (item?.data?.message.trim().indexOf('wants') === -1
                      ? format(item?.data?.time ? new Date(item?.data?.time) : new Date(), ' hh:mm a, LLLL dd, yyyy')
                      : '') ?? `<b></b>`
                }
              />
            );
          }
          case TYPE_NOTIFICATION.DISABLE_CREATE_CONVERSATION: {
            return (
              <CardNotification
                item={item}
                disablePressNotification={true}
                createdAt={item?.createdAt}
                user={item.data?.userInfo}
                onPressAvatar={_navigateProfile}
                messageHasBold={
                  item?.data?.message.trim() +
                    (item?.data?.message.trim().indexOf('wants') === -1
                      ? format(item?.data?.time ? new Date(item?.data?.time) : new Date(), ' hh:mm a, LLLL dd, yyyy')
                      : '') ?? `<b></b>`
                }
              />
            );
          }
          case TYPE_NOTIFICATION.ADD_STUMP: {
            return (
              <CardNotification
                item={item}
                disablePressNotification={false}
                pressNotificationGetStumpId={_notiLike}
                onPressAvatar={_navigateProfile}
                user={item.data?.userInfo}
                createdAt={item.createdAt}
                messageHasBold={item?.data?.message.trim() ?? `<b></b>`}
              />
            );
          }
          case TYPE_NOTIFICATION.CONTACT: {
            return (
              <CardNotification
                item={item}
                disablePressNotification={false}
                createdAt={item.createdAt}
                pressNotificationGetUserId={_navigateProfile}
                user={item.data?.userInfo}
                messageHasBold={
                  item?.data?.message.trim() +
                    (item?.data?.time ? format(new Date(item?.data?.time), ' hh:mm a, LLLL dd, yyyy') : '') ?? `<b></b>`
                }
              />
            );
          }
          case TYPE_NOTIFICATION.MENTION: {
            return (
              <CardNotification
                item={item}
                disablePressNotification={false}
                onPressNotificationMention={_mention}
                createdAt={item.createdAt}
                user={item.data?.userInfo}
                onPressAvatar={_navigateProfile}
                messageHasBold={
                  item?.data?.message.trim() +
                    (item?.data?.time ? format(new Date(item?.data?.time), ' hh:mm a, LLLL dd, yyyy') : '') ?? `<b></b>`
                }
              />
            );
          }
          case TYPE_NOTIFICATION.CHAT: {
            return (
              <CardNotification
                item={item}
                showLogo={true}
                disablePressNotification={false}
                onPressNotificationChat={_chat}
                createdAt={item.createdAt}
                user={item.data?.userInfo}
                onPressAvatar={_navigateProfile}
                messageHasBold={
                  item?.data?.message.trim() +
                    (item?.data?.time ? format(new Date(item?.data?.time), ' hh:mm a, LLLL dd, yyyy') : '') ?? `<b></b>`
                }
              />
            );
          }
          default: {
            return null;
          }
        }
      },
    [
      _chat,
      _followBack,
      _hideNoti,
      _mention,
      _navigateProfile,
      _notiCreateConversation,
      _notiFollow,
      _notiLike,
      _remindConversation,
      _tickCheckmark,
      userInfo,
    ],
  );

  const loadMore = React.useCallback(async () => {
    if (state.loadingMore) {
      return;
    }
    if (state.currentPage >= state.maxPage) {
      return;
    }
    setState(preState => ({ ...preState, currentPage: preState.currentPage + 1, loadingMore: true }));
  }, [state.loadingMore, state.currentPage, state.maxPage]);

  const onRefresh = React.useCallback(async () => {
    setState(preState => ({ ...preState, refreshing: true }));
    await _getPageOne();
  }, []);

  const keyExtractor = React.useMemo(() => (item: Notification) => item.id.toString(), []);

  const refreshControl = React.useMemo(() => <RefreshControl refreshing={false} onRefresh={onRefresh} />, [onRefresh]);

  const ListEmptyComponent = React.useMemo(
    () => (
      <ViewWrapStyled>
        <TextEmptyStyled>You have no notifications.</TextEmptyStyled>
      </ViewWrapStyled>
    ),
    [],
  );

  const memoizedData = React.useMemo(
    () =>
      [...unionBy(isToggle ? state.data : state.data.filter(noti => !noti.isHide), 'id')].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [isToggle, state.data],
  );

  return (
    <ContainerStyled>
      {state.showToggle && (
        <View style={styles.viewToggle}>
          <HighlightTextStyled>Toggle hidden</HighlightTextStyled>
          <View style={styles.viewSwitch}>
            <Switch
              trackColor={{ false: Platform.OS === 'android' ? '#d3d3d3' : '#fbfbfb', true: Colors.Background2 }}
              thumbColor={1 ? Colors.White : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isToggle}
            />
          </View>
        </View>
      )}

      {!state.loading ? (
        <FlatList
          contentContainerStyle={contentContainerStyle}
          data={memoizedData}
          renderItem={RenderNotification}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          refreshControl={refreshControl}
          ListEmptyComponent={ListEmptyComponent}
        />
      ) : (
        <View style={[commonStyles.containerFlatlist, commonStyles.pd_horizontal_10]}>
          <Skeleton size={Math.ceil(Dimensions.get('window').height / scale(160))} />
        </View>
      )}
    </ContainerStyled>
  );
};

export default React.memo(NotificationComponent);
