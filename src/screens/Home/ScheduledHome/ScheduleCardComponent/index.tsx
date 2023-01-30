import { format } from 'date-fns';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import {
  _padding,
  AvatarContainerStyled,
  InformationCardStyled,
  ListParticipantStyled,
  TextDurationStyled,
  TextGuestStyled,
  TextParticipantStyled,
  TextStartStyled,
  TextTitleStyled,
  TouchStartStyled,
  ViewContainerCard,
  ViewStartStyled,
} from './styles';
import { Conversation } from '@/stores/types/record.type';
import { FieldSchedule, Participant, useAppDispatch } from '@/stores';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { useGetMyId } from '@/hooks/useGetMyId';
import { useAuth } from '@/hooks/useAuth';
import {
  APP_NAVIGATION,
  CHAT_NAVIGATION,
  CONVERSATION_STATUS,
  FILE_TYPE,
  HOME_NAVIGATION,
  PROFILE_NAVIGATION,
  RECORD_MODE,
  RECORD_NAVIGATION,
  ROOT_ROUTES,
} from '@/constants';
import { navigationRef } from '@/navigators/refs';
import { sortParticipantByHostHelper } from '@/utils/array';
import { Colors } from '@/theme/colors';
import { formatTime } from '@/utils/format';
import { scale } from 'react-native-size-scaling';
import { commonStyles, indicateHostStyle, ViewIndicateHost } from '@/styles/common';
import { ImageComponent } from '@/containers/components/ImageComponent';
import SwipeableComponent from '@/containers/components/SwipeableComponent';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { conversationController } from '@/controllers/conversation.controller';
import { globalLoading } from '@/containers/actions/emitter.action';
import { commonSlice, recordSlice } from '@/stores/reducers';
import { chooseFileModalRef } from '@/refs';
import { stumpController } from '@/controllers';
import { IconChat, IconPlay } from '@/assets/icons/Icon';
import { IProps } from './propState';
import { requestMicroPermission } from '@/utils/permission';
import { promptHelper } from '@/utils/helper';
import { socketRecord } from '@/networking/SocketRecord';
import { SOCKET_RECORD_EVENT } from '@/networking/SocketRecord';
import { chatController } from '@/controllers/chat.controller';
import { TextComponent } from '@/containers/components/TextComponent';

const ScheduleCardComponent = (props: IProps) => {
  const { data, navigation } = props;
  const userInfo = useAuth();
  const myId = useGetMyId();
  const { isBlockMe } = useUserBlockMe();
  const dispatch = useAppDispatch();

  const _decline = React.useCallback(async () => {
    try {
      globalLoading(true);
      await promptHelper('Are you sure?', `Are you sure that you want to decline it.`, 'Cancel', 'Decline');
      await conversationController.declineAcceptedConversation(data.hostId, data.id);
      dispatch(getNumberConversation());
      // dispatch(declineAcceptedConversation({ id: data.id }));
      // dispatch(setIsFetchNoti(true));
    } catch (error) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [data.hostId, data.id, dispatch]);

  const _editSchedule = React.useCallback(() => {
    props.navigation.push(HOME_NAVIGATION.RESCHEDULEHOME, { data });
  }, [data, props.navigation]);

  const _goToRecording = React.useCallback(async () => {
    try {
      globalLoading(true);
      const res_get_detail = await conversationController.getDetailConversation(data.id);

      if (res_get_detail.status === 1) {
        const participant: Participant[] = res_get_detail.data[0].participants.filter(par => {
          // par.inviteValue?.toLowerCase() === userInfo?.email?.toLowerCase()
          if (par.user) {
            return par.user?.email?.toLowerCase() === userInfo?.email?.toLowerCase();
          } else {
            return par.inviteValue?.toLowerCase() === userInfo?.email?.toLowerCase();
          }
        });
        const fileArr = res_get_detail.data[0].files.filter(item => !!item.filePath);
        const duration = fileArr.length
          ? fileArr.reduce((curr, prev) => (curr += prev.duration ?? 0), 0)
          : res_get_detail.data[0].duration || 0;
        dispatch(
          recordSlice.actions.setConfig({
            role: props.field === 'schedule' ? 'host' : 'participant',
            roomDetail: res_get_detail.data[0],
            participantToEmit: res_get_detail.data[0].participants,
            stoped: false,
            start_time: 0,
            duration,
          }),
        );

        dispatch(getNumberConversation());

        const permission = await requestMicroPermission();
        if (!permission) {
          return;
        }
        socketRecord.emit(SOCKET_RECORD_EVENT.LEAVE, null);
        navigation.navigate(APP_NAVIGATION.CREATE, {
          screen: RECORD_NAVIGATION.RECORDING,
          initial: false,
          params: {
            conversationId: data.id.toString(),
            inviteCode: participant.length ? participant[0].inviteCode : '',
          },
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [data.id, dispatch, navigation, props.field, userInfo?.email]);

  const _gotoProfile = React.useCallback(
    (userId: number) => () => {
      try {
        if (!userId) {
          return;
        }
        isBlockMe(userId);
        if (userId === userInfo?.id) {
          navigationRef?.current?.navigate(APP_NAVIGATION.PROFILE, {
            screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
            initial: false,
          });
          return;
        }
        navigationRef?.current?.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.VIEW_PROFILE,
          initial: false,
          params: { userId, screen: props.screen },
        });
      } catch (error) {
        //
      }
    },
    [isBlockMe, props.screen, userInfo?.id],
  );

  const pressHandlerMessage = React.useCallback(async () => {
    try {
      const members = (props.data as Conversation).participants
        .filter(e => !!e.userId && e.userId !== myId)
        .map(p => p.userId) as number[];
      const res = await chatController.createRoom(members, 'GROUP_CHAT', (props.data as Conversation).id);
      navigationRef?.current?.navigate(ROOT_ROUTES.CHAT, {
        screen: CHAT_NAVIGATION.ALL_CONVERSATION,
        initial: false,
        params: { type: 'CHAT', title: 'Messages', screen: props.screen },
      });
      navigationRef?.current?.navigate(ROOT_ROUTES.CHAT, {
        screen: CHAT_NAVIGATION.IN_ROOM_CHAT,
        initial: false,
        params: { roomId: res.data.roomId, screen: props.screen },
      });
    } catch (error) {
      console.log(error);
    }
  }, [myId, props.data, props.screen]);

  const RenderParticipant = React.useMemo(
    () => (
      <ListParticipantStyled>
        {sortParticipantByHostHelper(data.participants || []).map((p, index: number) => {
          return (
            <TouchableOpacity key={p.id} onPress={_gotoProfile(Number(p.userId))}>
              {p.user ? (
                <TextParticipantStyled numberOfLines={1}>
                  @
                  <TextComponent style={{ textDecorationLine: 'underline' }}>
                    {p.user?.displayName?.split(' ').join('')}
                  </TextComponent>
                </TextParticipantStyled>
              ) : data.hostId === userInfo?.id ? (
                <TextParticipantStyled numberOfLines={1}>{p?.inviteValue}</TextParticipantStyled>
              ) : (
                <TextGuestStyled numberOfLines={1}>{`Guest ${index + 1}`}</TextGuestStyled>
              )}
            </TouchableOpacity>
          );
        })}
      </ListParticipantStyled>
    ),
    [_gotoProfile, data, userInfo?.id],
  );

  const playAudio = React.useCallback(() => {
    const hasMergeFile = data?.files?.filter(file => file.fileType === FILE_TYPE.MERGE && !!file.filePath) || [];
    const partialFile = data?.files?.filter(file => file.fileType !== FILE_TYPE.MERGE && !!file.filePath) || [];
    if (hasMergeFile.length) {
      const newData = {
        ...data,
        title: (data?.draft && JSON.parse(data?.draft).title) || '',
        description: (data?.draft && JSON.parse(data?.draft).description) || '',
        file: hasMergeFile,
        screen: props.screen,
        notStump: true,
        duration: hasMergeFile[0].duration,
        listStump: [],
        conversationId: data.id,
      };
      dispatch(commonSlice.actions.setPlayStump(newData as any));
    } else {
      if (partialFile.length === 1) {
        const newData = {
          ...data,
          title: (data?.draft && JSON.parse(data?.draft).title) || '',
          description: (data?.draft && JSON.parse(data?.draft).description) || '',
          file: partialFile,
          screen: props.screen,
          notStump: true,
          duration: partialFile[0].duration,
          listStump: [],
          conversationId: data.id,
        };
        dispatch(commonSlice.actions.setPlayStump(newData as any));
      } else {
        chooseFileModalRef?.current?.open(data);
      }
    }
  }, [data, dispatch, props.screen]);

  const RenderDuration = React.useMemo(() => {
    const hasMergeFile = data?.files?.filter(file => file.fileType === FILE_TYPE.MERGE && !!file.filePath);
    const files = hasMergeFile.length
      ? hasMergeFile
      : data?.files?.filter(file => file.fileType !== FILE_TYPE.MERGE && !!file.filePath);
    return (
      <>
        {files.length ? (
          <TextDurationStyled color={Colors.Black}>
            Duration:{' '}
            <TextDurationStyled color={Colors.Black} fontWeight={'bold'}>
              {formatTime(files?.reduce((curr, prev) => (curr += prev.duration ?? 0), 0))}
            </TextDurationStyled>
          </TextDurationStyled>
        ) : (
          <TextDurationStyled color={Colors.Black} />
        )}
      </>
    );
  }, [data]);

  const RenderAvatar = React.useMemo(
    () => (
      <AvatarContainerStyled>
        {sortParticipantByHostHelper(data?.participants || []).map((p, index: number) => {
          return data.mode === RECORD_MODE.FRIENDS && data?.participants.length > 1 ? (
            <TouchableOpacity key={p.id} style={_padding(index)} onPress={_gotoProfile(Number(p.userId))}>
              <ViewIndicateHost width={scale(44)}>
                <ImageComponent
                  uri={p?.user?.avatar || ''}
                  width={scale(44)}
                  height={scale(44)}
                  borderRadius={scale(44)}
                />
                {p.isHost && <View style={indicateHostStyle} />}
              </ViewIndicateHost>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={p.id} onPress={_gotoProfile(Number(p.userId))}>
              <ViewIndicateHost width={scale(88)}>
                <ImageComponent
                  uri={p?.user?.avatar || ''}
                  width={scale(88)}
                  height={scale(88)}
                  borderRadius={scale(88)}
                />
                {p.isHost && <View style={indicateHostStyle} />}
              </ViewIndicateHost>
            </TouchableOpacity>
          );
        })}
        {data?.participants?.length < 3 ? <View style={{ width: scale(44), height: scale(44) }} /> : null}
      </AvatarContainerStyled>
    ),
    [_gotoProfile, data],
  );

  const RenderButtonGroup = React.useMemo(() => {
    const btns =
      props.field === 'schedule' ? (
        <>
          <TouchStartStyled onPress={_goToRecording}>
            <TextStartStyled>Start now</TextStartStyled>
          </TouchStartStyled>
          <TouchStartStyled onPress={_editSchedule} backgroundColor={Colors.Graylish_blue}>
            <TextStartStyled>Edit</TextStartStyled>
          </TouchStartStyled>
        </>
      ) : (
        <>
          <TouchStartStyled onPress={_goToRecording}>
            <TextStartStyled>Join now</TextStartStyled>
          </TouchStartStyled>
          <TouchStartStyled backgroundColor={Colors.Vivid_red} onPress={_decline}>
            <TextStartStyled>Decline</TextStartStyled>
          </TouchStartStyled>
        </>
      );
    return (
      <ViewStartStyled>
        {btns}
        {data?.files?.filter(file => !!file.filePath)?.length ? (
          <TouchableOpacity onPress={playAudio} style={{ marginLeft: 'auto' }}>
            <IconPlay width={scale(20)} height={scale(20)} fill={Colors.Background2} />
          </TouchableOpacity>
        ) : null}
      </ViewStartStyled>
    );
  }, [_decline, _editSchedule, _goToRecording, data?.files, playAudio, props.field]);

  return (
    <SwipeableComponent
      myId={userInfo?.id ?? 0}
      type={'conversation'}
      data={data}
      editable={false}
      screen={props.screen || ''}
      typeScreen={'schedule'}>
      <TouchableOpacity style={[commonStyles.flatlist_item]} activeOpacity={1}>
        <ViewContainerCard>
          {RenderAvatar}
          <InformationCardStyled>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {RenderParticipant}
              <TouchableOpacity onPress={pressHandlerMessage}>
                <IconChat width={scale(20)} height={scale(20)} fill={Colors.Background2} />
              </TouchableOpacity>
            </View>
            <TextTitleStyled>{format(new Date(data?.scheduledStart), 'hh:mm a')}</TextTitleStyled>
            {RenderDuration}
            {RenderButtonGroup}
          </InformationCardStyled>
        </ViewContainerCard>
      </TouchableOpacity>
    </SwipeableComponent>
  );
};

export default React.memo(ScheduleCardComponent);
