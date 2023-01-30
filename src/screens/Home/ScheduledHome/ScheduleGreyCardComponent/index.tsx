import { format } from 'date-fns';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import {
  _padding,
  AvatarContainerStyled,
  InformationCardStyled,
  ListParticipantStyled,
  styles,
  TextDurationStyled,
  TextParticipantStyled,
  TextTitleStyled,
  TouchStartStyled,
  ViewContainerCard,
} from './styles';
import { Conversation } from '@/stores/types/record.type';
import { FieldSchedule, useAppDispatch } from '@/stores';
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
import { chatController } from '@/controllers/chat.controller';
import { TextComponent } from '@/containers/components/TextComponent';

interface IProps {
  data: Conversation;
  navigation: any;
  screen?: string;
  field: FieldSchedule;
}

const ScheduleGreyCardComponent = (props: IProps) => {
  const { data, navigation } = props;
  const userInfo = useAuth();
  const dispatch = useAppDispatch();
  const myId = useGetMyId();
  const { isBlockMe } = useUserBlockMe();

  const _goToRecording = async () => {
    try {
      if (data.hostId !== userInfo?.id) {
        Alert.alert('', 'This stump has not yet been published.');
        return;
      }
      globalLoading(true);
      const res_get_detail = await conversationController.getDetailConversation(data.id);

      if (res_get_detail.status === 1) {
        dispatch(
          recordSlice.actions.setConfig({
            stoped: true,
            start_time: 0,
            roomDetail: res_get_detail.data[0],
          }),
        );
        dispatch(getNumberConversation());

        let draft;
        if (res_get_detail.data[0]?.draft) {
          draft = JSON.parse(res_get_detail.data[0]?.draft);
        }

        navigation.navigate(APP_NAVIGATION.CREATE, {
          screen: RECORD_NAVIGATION.PUBLISH,
          initial: false,
          params: {
            title: draft?.title || '',
            tag: draft?.tag || [],
            description: draft?.description || '',
            screen: HOME_NAVIGATION.SCHEDULEDHOME,
          },
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  };

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

  const RenderParticipant = React.useMemo(() => {
    const participants =
      sortParticipantByHostHelper(data.participants || []).filter(p => !!p.active && !!p.isAccepted) || [];
    return (
      <ListParticipantStyled>
        {participants?.map(p => {
          return (
            <TouchableOpacity key={p.id} onPress={_gotoProfile(Number(p.userId))}>
              <TextParticipantStyled numberOfLines={1}>
                @
                <TextComponent style={{ textDecorationLine: 'underline' }}>
                  {p.userId ? p.user?.displayName?.split(' ').join('') : p?.inviteValue?.split('@')[0]}
                </TextComponent>
              </TextParticipantStyled>
            </TouchableOpacity>
          );
        })}
      </ListParticipantStyled>
    );
  }, [_gotoProfile, data.participants]);

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
  }, [data?.files]);

  const _onTapCard = async () => {
    if (data.status === CONVERSATION_STATUS.PUBLISHED) {
      const res = await stumpController.getDetailStump(data.stumpId);
      if (res.status === 1 && res.data[0]) {
        dispatch(commonSlice.actions.setPlayStump({ ...res.data[0], screen: HOME_NAVIGATION.SCHEDULEDHOME }));
      }
    }
    if (data.status === CONVERSATION_STATUS.FINISHED) {
      await _goToRecording();
    }
  };

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

  const validParticipantArr = React.useMemo(
    () => sortParticipantByHostHelper(data?.participants || [])?.filter(p => !!p.active && !!p.isAccepted),
    [data?.participants],
  );

  const RenderStatusConversation = React.useMemo(() => {
    const myParticiantActive = data?.participants.filter(
      p => p.userId === userInfo?.id && (!p.active || !p.isAccepted),
    );
    if (myParticiantActive.length) {
      return <TextComponent style={styles.statusRotate}>MISSED</TextComponent>;
    }
    if (data?.status === CONVERSATION_STATUS.PUBLISHED) {
      return <TextComponent style={styles.statusRotate}>PUBLISHED</TextComponent>;
    }
    if (data?.status === CONVERSATION_STATUS.FINISHED) {
      return <TextComponent style={styles.statusRotate}>FINISHED</TextComponent>;
    }
  }, [data, userInfo?.id]);

  const RenderAvatar = React.useMemo(
    () => (
      <AvatarContainerStyled>
        {validParticipantArr?.map((p, index: number) => {
          return data.mode === RECORD_MODE.FRIENDS && validParticipantArr.length > 1 ? (
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
        {validParticipantArr.length < 3 ? <View style={{ width: scale(44), height: scale(44) }} /> : null}
      </AvatarContainerStyled>
    ),
    [_gotoProfile, data.mode, validParticipantArr],
  );

  const RenderButtonGroup = React.useMemo(() => {
    if (data.status === CONVERSATION_STATUS.FINISHED) {
      return null;
    }
    return (
      <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
        {data?.files?.filter(file => !!file.filePath)?.length ? (
          <TouchStartStyled backgroundColor={'transparent'} onPress={playAudio}>
            <IconPlay width={scale(20)} height={scale(20)} fill={Colors.Background2} />
          </TouchStartStyled>
        ) : null}
      </View>
    );
  }, [data?.files, data.status, playAudio]);

  return (
    <SwipeableComponent
      myId={userInfo?.id ?? 0}
      type={'conversation'}
      data={data}
      editable={false}
      screen={props.screen || ''}
      typeScreen={'schedule'}>
      <TouchableOpacity style={[commonStyles.flatlist_item, styles.relative]} onPress={_onTapCard} activeOpacity={0.7}>
        {RenderStatusConversation}
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

export default React.memo(ScheduleGreyCardComponent);
