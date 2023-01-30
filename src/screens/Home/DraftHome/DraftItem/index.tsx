import { IconPlay } from '@/assets/icons/Icon';
import {
  APP_NAVIGATION,
  CONVERSATION_STATUS,
  HOME_NAVIGATION,
  PROFILE_NAVIGATION,
  RECORD_MODE,
  RECORD_NAVIGATION,
  SEARCH_NAVIGATION,
} from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { HashtagStyled, TextHashtagStyled, ViewTitleStyled } from '@/containers/components/CardComponent/styles';
import { ImageComponent } from '@/containers/components/ImageComponent';
import SwipeableComponent from '@/containers/components/SwipeableComponent';
import { conversationController } from '@/controllers/conversation.controller';
import { useGetMyId } from '@/hooks/useGetMyId';
import { useUserBlockMe } from '@/hooks/useUserBlockMe';
import { navigationRef } from '@/navigators/refs';
import { useAppDispatch } from '@/stores';
import { commonSlice, recordSlice } from '@/stores/reducers';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { commonStyles, indicateHostStyle, ViewIndicateHost } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { sortParticipantByHostHelper } from '@/utils/array';
import { formatTime } from '@/utils/format';
import { requestMicroPermission } from '@/utils/permission';
import { format } from 'date-fns';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { IProps } from './propState';
import { SOCKET_RECORD_EVENT, socketRecord } from '@/networking/SocketRecord';

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
import { chooseFileModalRef } from '@/refs';
import { TextComponent } from '@/containers/components/TextComponent';

const DrafItem = (props: IProps) => {
  const { data, navigation } = props;
  const userIdAuthState = useGetMyId();
  const dispatch = useAppDispatch();
  const { isBlockMe } = useUserBlockMe();
  const _goToRecording = React.useCallback(async () => {
    try {
      globalLoading(true);
      const res_get_detail = await conversationController.getDetailConversation(data.id);

      if (res_get_detail.status === 1) {
        const fileArr = res_get_detail.data[0].files.filter(item => !!item.filePath);
        const duration = fileArr.length
          ? fileArr.reduce((curr, prev) => (curr += prev.duration ?? 0), 0)
          : res_get_detail.data[0].duration || 0;
        dispatch(
          recordSlice.actions.setConfig({
            role: 'host',
            roomDetail: res_get_detail.data[0],
            participantToEmit: res_get_detail.data[0].participants,
            stoped: false,
            start_time: 0,
            duration,
          }),
        );
        dispatch(getNumberConversation());

        if (data.status === CONVERSATION_STATUS.PAUSED) {
          const permission = await requestMicroPermission();
          if (!permission) {
            return;
          }
          socketRecord.emit(SOCKET_RECORD_EVENT.LEAVE, null);
          dispatch(recordSlice.actions.setConfig({ start_time: 0, stoped: false }));
          navigation.navigate(APP_NAVIGATION.CREATE, {
            screen: RECORD_NAVIGATION.RECORDING,
            initial: false,
            params: { conversationId: data.id.toString() },
          });
        } else {
          dispatch(recordSlice.actions.setConfig({ stoped: true, start_time: 0 }));
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
              screen: HOME_NAVIGATION.DRAFTHOME,
            },
          });
        }
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [data.id, data.status, dispatch, navigation]);

  const _gotoProfile = React.useCallback(
    (userId: number) => () => {
      try {
        if (!userId) {
          return;
        }
        isBlockMe(userId);
        if (userId === userIdAuthState) {
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
    [isBlockMe, props.screen, userIdAuthState],
  );

  const _publish = async () => {
    if (data.status !== CONVERSATION_STATUS.FINISHED) {
      return;
    }
    await _goToRecording();
  };

  const RenderParticipantAvatar = React.useMemo(() => {
    const participants =
      data?.status === CONVERSATION_STATUS.FINISHED || data?.status === CONVERSATION_STATUS.PUBLISHED
        ? data?.participants?.filter(p => !!p.active && !!p.isAccepted)
        : data?.participants;
    return (
      <>
        {sortParticipantByHostHelper(participants || [])?.map((p, index: number) => {
          return data.mode === RECORD_MODE.FRIENDS && participants.length > 1 ? (
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
        {participants?.length < 3 ? <View style={{ width: scale(44), height: scale(44) }} /> : null}
      </>
    );
  }, [_gotoProfile, data.mode, data?.participants, data?.status]);

  const RenderParticipantDisplayName = () => {
    const participants =
      data?.status === CONVERSATION_STATUS.FINISHED || data?.status === CONVERSATION_STATUS.PUBLISHED
        ? data?.participants?.filter(p => !!p.active && !!p.isAccepted)
        : data?.participants;
    return (
      <ListParticipantStyled>
        {sortParticipantByHostHelper(participants || [])?.map((p, index) => {
          return (
            <TouchableOpacity key={p.id} onPress={_gotoProfile(Number(p.userId))}>
              {p.user ? (
                <TextParticipantStyled numberOfLines={1}>
                  @
                  <TextComponent style={{ textDecorationLine: 'underline' }}>
                    {p.user?.displayName?.split(' ').join('')}
                  </TextComponent>
                </TextParticipantStyled>
              ) : data.hostId === userIdAuthState ? (
                <TextParticipantStyled numberOfLines={1}>
                  @
                  <TextComponent style={{ textDecorationLine: 'underline' }}>
                    {p?.inviteValue?.split('@')[0]}
                  </TextComponent>
                </TextParticipantStyled>
              ) : (
                <TextGuestStyled numberOfLines={1}>{`Guest ${index + 1}`}</TextGuestStyled>
              )}
            </TouchableOpacity>
          );
        })}
      </ListParticipantStyled>
    );
  };

  const playAudio = React.useCallback(() => {
    if (data.files?.length && data.status === CONVERSATION_STATUS.FINISHED) {
      const newData = {
        ...data,
        title: (data?.draft && JSON.parse(data?.draft).title) || '',
        description: (data?.draft && JSON.parse(data?.draft).description) || '',
        file: [data.files[data.files.length - 1]],
        screen: props.screen,
        notStump: true,
        duration: data.files[data.files.length - 1].duration,
        listStump: [],
        conversationId: data.id,
      };
      dispatch(commonSlice.actions.setPlayStump(newData as any));
      return;
    }
    if (data.files?.length && data.files?.length === 1) {
      const newData = {
        ...data,
        title: (data?.draft && JSON.parse(data?.draft).title) || '',
        description: (data?.draft && JSON.parse(data?.draft).description) || '',
        file: data.files,
        screen: props.screen,
        notStump: true,
        duration: data.files[0].duration,
        listStump: [],
        conversationId: data.id,
      };
      dispatch(commonSlice.actions.setPlayStump(newData as any));
    } else {
      chooseFileModalRef?.current?.open(data);
    }
  }, [data, dispatch, props.screen]);

  const RenderButton = React.useMemo(() => {
    switch (data.status) {
      case CONVERSATION_STATUS.FINISHED:
        return (
          <ViewStartStyled>
            <TouchStartStyled backgroundColor={'transparent'} disabled={true} />
            {data?.files?.filter(file => !!file.filePath).length ? (
              <TouchStartStyled backgroundColor={'transparent'} onPress={playAudio}>
                <IconPlay width={scale(20)} height={scale(20)} fill={Colors.Background2} />
              </TouchStartStyled>
            ) : null}
          </ViewStartStyled>
        );
      case CONVERSATION_STATUS.PAUSED:
        return (
          <ViewStartStyled>
            <TouchStartStyled onPress={_goToRecording} backgroundColor={Colors.Background2}>
              <TextStartStyled>Resume call</TextStartStyled>
            </TouchStartStyled>
            {data?.files?.filter(file => !!file.filePath).length ? (
              <TouchStartStyled backgroundColor={'transparent'} onPress={playAudio}>
                <IconPlay width={scale(20)} height={scale(20)} fill={Colors.Background2} />
              </TouchStartStyled>
            ) : null}
          </ViewStartStyled>
        );
      default:
        return <></>;
    }
  }, [_goToRecording, data?.files, data.status, playAudio]);

  const _clickHashTag = (hashTag: string) => () => {
    props.navigation.navigate(APP_NAVIGATION.SEARCH, {
      screen: SEARCH_NAVIGATION.SEARCH,
      params: { hashTag, indexActive: { index: 2 } },
      initial: false,
    });
  };

  const RenderHashTag = (hashTags: string[]) => {
    return (
      <>
        {hashTags?.map((hashTag, index: number) =>
          hashTag?.length ? (
            <TouchableOpacity key={index} onPress={_clickHashTag(hashTag)}>
              <TextHashtagStyled numberOfLines={1}>#{hashTag}</TextHashtagStyled>
            </TouchableOpacity>
          ) : null,
        )}
      </>
    );
  };

  const lengthValidFiles = React.useMemo(() => data?.files?.filter(file => !!file.filePath).length, [data?.files]);

  return (
    <SwipeableComponent
      myId={userIdAuthState ?? 0}
      type={'conversation'}
      data={data}
      editable={false}
      screen={props.screen || ''}
      typeScreen={'draft'}>
      <TouchableOpacity style={commonStyles.flatlist_item} onPress={_publish} activeOpacity={0.9}>
        <ViewContainerCard>
          <AvatarContainerStyled>{RenderParticipantAvatar}</AvatarContainerStyled>
          <InformationCardStyled>
            {data?.draft && JSON.parse(data?.draft).title ? (
              <ViewTitleStyled>
                <TextTitleStyled numberOfLines={2}>{JSON.parse(data?.draft).title}</TextTitleStyled>
              </ViewTitleStyled>
            ) : null}
            {data?.draft && JSON.parse(data?.draft).description ? (
              <TextHashtagStyled numberOfLines={2}>{JSON.parse(data?.draft).description}</TextHashtagStyled>
            ) : null}
            {RenderParticipantDisplayName()}
            {data?.draft && JSON.parse(data?.draft).tag?.length ? (
              <HashtagStyled>{RenderHashTag(JSON.parse(data?.draft).tag)}</HashtagStyled>
            ) : null}
            <TextTitleStyled>{format(new Date(data?.scheduledStart), 'hh:mm a')}</TextTitleStyled>
            {lengthValidFiles ? (
              <TextDurationStyled color={Colors.Black}>
                Duration:{' '}
                <TextDurationStyled color={Colors.Black} fontWeight={'bold'}>
                  {data.status !== CONVERSATION_STATUS.FINISHED &&
                    formatTime(data?.files.reduce((curr, prev) => (curr += prev.duration ?? 0), 0))}
                  {data.status === CONVERSATION_STATUS.FINISHED &&
                    formatTime(data?.files[data?.files?.length - 1].duration)}
                </TextDurationStyled>
              </TextDurationStyled>
            ) : null}
            {RenderButton}
          </InformationCardStyled>
        </ViewContainerCard>
      </TouchableOpacity>
    </SwipeableComponent>
  );
};

export default React.memo(DrafItem);
