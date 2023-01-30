import { useAuth } from '@/hooks/useAuth';
import { Participant, useAppDispatch, useAppSelector } from '@/stores';
import React, { useCallback, useEffect, useState } from 'react';
import { IProps, IState } from './propState';
import { SOCKET_RECORD_EVENT, socketRecord } from '@/networking/SocketRecord';
import { AGORA_APP_ID, CONVERSATION_STATUS, RECORD_NAVIGATION } from '@/constants';
import { commonSlice, recordSlice } from '@/stores/reducers';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import Toast from 'react-native-toast-message';
import DismissKeyboard from '@/containers/components/DismissKeyboard';
import KeepAwake from 'react-native-keep-awake';
import { CenterViewStyled, ContainerStyled } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { scale } from 'react-native-size-scaling';
import { ViewStyled } from './styles';
import { getDevInfo } from './func';
import { agoraController } from '@/controllers/agora.controller';
import { sortParticipantByHostHelper } from '@/utils/array';
import RenderParticipant from './RenderParticipant';
import ViewAudio from './ViewAudio';
import Timer from './Timer';
import ButtonRecord from './ButtonRecord';
import RtcEngine, { ChannelProfile, ClientRole, RtcEngineContext } from 'react-native-agora';
import { cloneDeep } from 'lodash';

const RecordingComponent = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { joinStatus, role, roomDetail, participantToEmit } = useAppSelector(rootState => ({
    joinStatus: rootState.recordState.joinStatus,
    role: rootState.recordState.role,
    participantToEmit: rootState.recordState.participantToEmit,
    roomDetail: rootState.recordState.roomDetail,
  }));

  const userInfo = useAuth();

  const [state, setState] = useState<IState>({
    channelData: {
      cname: '',
      token: '',
      uid: '',
    },
    participants: [],
    routing: -1,
  });
  const UID = Math.floor(Math.random() * 99999999) + 1;

  const getTokenAgora = async (channelName: string, uid: number) => {
    const json: any = await agoraController.requestTokenAgora(channelName, uid);
    console.log({ json });

    await _initEngine(json.cname, json.uid, json.token);
  };

  const leaveChannel = useCallback(async () => {
    if (AGORA_APP_ID) {
      const engine = await RtcEngine.createWithContext(new RtcEngineContext(AGORA_APP_ID));
      engine.removeAllListeners();
      await engine.leaveChannel();
      await engine.destroy();
      console.log('engine leave destroy');
    }
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const _emitJoin = async (data: any) => {
    const { deviceInfo } = await getDevInfo();
    socketRecord.emit(SOCKET_RECORD_EVENT.JOIN, { ...data, ...{ myId: userInfo?.id }, deviceInfo });
  };

  useEffect(() => {
    dispatch(commonSlice.actions.setPlayStump());
    dispatch(
      recordSlice.actions.setConfig({
        recordingScreen: 'recording',
      }),
    );
    return () => {
      dispatch(
        recordSlice.actions.setConfig({
          recordingScreen: '',
        }),
      );
    };
  }, [dispatch]);

  useEffect(() => {
    if (!socketRecord.socket?.connected) {
      props.navigation.navigate(RECORD_NAVIGATION.FIRST_STEP);
      return;
    }
    return () => {
      leaveChannel();
      dispatch(
        recordSlice.actions.setConfig({
          start_time: 0,
          joinStatus: undefined,
        }),
      );
    };
  }, [socketRecord.socket?.connected]);

  useEffect(() => {
    if (!participantToEmit) {
      return;
    }
    let new_user: Participant[];
    console.log('participantToEmit', participantToEmit);
    console.log('role', role);

    //emit join with respective participants
    if (role === 'host') {
      new_user = participantToEmit?.filter(p => p.isHost);
      if (new_user.length) {
        getTokenAgora(new_user[0].conversationId?.toString() || '', new_user[0].id);
        _emitJoin({ ...new_user[0], ...{ channelName: new_user[0].conversationId?.toString() } });
      }
    } else {
      new_user = participantToEmit?.filter(
        p => !p.isHost && p?.inviteCode?.toLowerCase() === props.route.params?.inviteCode?.toLowerCase(),
      );
      if (new_user.length) {
        getTokenAgora(new_user[0].conversationId?.toString() || '', new_user[0].id);
        _emitJoin({ ...new_user[0], ...{ channelName: new_user[0].conversationId?.toString() } });
      }
    }
  }, [participantToEmit, props.route.params?.inviteCode]);

  useEffect(() => {
    if (!joinStatus) {
      return;
    }
    if (!roomDetail && joinStatus && role === 'participant') {
      props.navigation.popToTop();
      socketRecord.emit(SOCKET_RECORD_EVENT.LEAVE, null);
      return;
    }
    if (!roomDetail) {
      return;
    }
    //leave user when decline join conversation from other device
    if (role === 'participant') {
      const userDecline = roomDetail.participants.filter(
        par => par?.inviteCode?.toLowerCase() === props.route.params?.inviteCode?.toLowerCase(),
      );
      if (!userDecline.length) {
        dispatch(
          recordSlice.actions.setConfig({
            roomDetail: undefined,
            joinStatus: undefined,
            participantToEmit: undefined,
          }),
        );
        _leave();
      }
    }

    const clone_participants = cloneDeep(roomDetail.participants);

    // map online when join room
    const participants = clone_participants.map(participant => {
      return { ...participant, online: joinStatus.joined?.includes(participant.id) };
    });
    setState(preState => ({ ...preState, participants }));
  }, [joinStatus, roomDetail]);

  const _initEngine = async (channelName: string, uid: string, token: string) => {
    try {
      if (!AGORA_APP_ID) {
        return;
      }
      await leaveChannel();
      const engine = await RtcEngine.createWithContext(new RtcEngineContext(AGORA_APP_ID));
      await engine.enableAudio();
      await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      await engine.setClientRole(ClientRole.Broadcaster);

      engine.addListener('Error', async err => {
        if (err === 17) {
          console.log('The request to join the channel is rejected', err);
          const json: any = await agoraController.requestTokenAgora(channelName, UID);

          if (!json) {
            return;
          }
          await _initEngine(json.cname, json.uid, json.token);
        } else {
          console.log('Error', err);
        }
      });

      engine.addListener('RequestToken', async () => {
        console.log('RequestToken: token has expired!!');

        const res_token: any = await agoraController.requestTokenAgora(channelName, UID);
        if (!res_token) {
          return;
        }
        await engine.renewToken(res_token.token);
        await engine.joinChannel(res_token.token, res_token.cname, null, Number(res_token.uid));
      });

      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
      });

      engine.addListener('LeaveChannel', stats => {
        console.log('LeaveChannel', stats);
      });

      engine.addListener('UserOffline', (localUID, reason) => {
        console.log('UserOffline', localUID, reason);
      });

      engine.addListener('ConnectionStateChanged', (connection, reason) => {
        console.log('ConnectionStateChanged', connection, reason);
      });

      engine.addListener('UserMuteAudio', (localUID, muted) => {
        console.log('UserMuteAudio', localUID, muted);
      });

      engine.addListener('LocalAudioStateChanged', (connection, err) => {
        if (err) {
          console.log(err, `err LocalAudioStateChanged`);
        } else {
          console.log(connection, `LocalAudioStateChanged`);
        }
      });

      engine.addListener('AudioRouteChanged', routing => {
        console.log('AudioRouteChanged', routing);
        setState(preState => ({ ...preState, routing }));
      });

      await engine.joinChannel(token, channelName, null, Number(uid));
      setState(preState => ({ ...preState, engine, channelData: { cname: channelName, uid, token } }));
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!roomDetail) {
      return;
    }
    if (roomDetail.status !== CONVERSATION_STATUS.UPLOADING) {
      return;
    }

    if (role === 'host') {
      leaveChannel().then(() => {
        props.navigation.replace(RECORD_NAVIGATION.PUBLISH);
        Toast.show({
          type: 'info',
          text1: `Stump`,
          text2: `Formatting audio. We will notify you when ready for upload.`,
          visibilityTime: 10000,
        });
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'The host has ended this call.',
      });
      _leave();
    }
  }, [roomDetail]);

  const _leave = useCallback(() => {
    leaveChannel().then(() => {
      dispatch(
        recordSlice.actions.setConfig({
          roomDetail: undefined,
          joinStatus: undefined,
          participantToEmit: undefined,
          postId: undefined,
          matchId: undefined,
          sportId: undefined,
          leagueId: undefined,
          teamId: undefined,
          marketId: undefined,
        }),
      );
      props.navigation.setParams({ inviteCode: null, conversationId: null });
      props.navigation.navigate(RECORD_NAVIGATION.FIRST_STEP);
      socketRecord.emit(SOCKET_RECORD_EVENT.LEAVE, null);
    });
  }, [dispatch, leaveChannel, props.navigation]);

  return (
    <DismissKeyboard>
      <ContainerStyled>
        <KeepAwake />
        {roomDetail ? (
          <ViewStyled>
            <View style={{ alignItems: 'center' }}>
              <RenderParticipant
                data={sortParticipantByHostHelper(state.participants || [])}
                mode={roomDetail?.mode}
                hostId={roomDetail?.hostId}
                myId={userInfo?.id || 0}
              />
              <Timer engine={state.engine} conversationId={roomDetail?.id || 0} role={role} />
              <ViewAudio
                engine={state.engine}
                routing={state.routing}
                conversationId={roomDetail?.id || 0}
                role={role}
                mode={roomDetail?.mode}
              />
            </View>
            <ButtonRecord
              role={role}
              conversationId={roomDetail?.id || 0}
              leave={_leave}
              navigation={props.navigation}
              mode={roomDetail?.mode}
            />
          </ViewStyled>
        ) : (
          <CenterViewStyled>
            <ActivityIndicator color={Colors.San_Marino} size={scale(40)} />
          </CenterViewStyled>
        )}
      </ContainerStyled>
    </DismissKeyboard>
  );
};
export default React.memo(RecordingComponent);
