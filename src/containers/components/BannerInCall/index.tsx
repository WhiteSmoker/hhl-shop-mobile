import { APP_NAVIGATION, CONVERSATION_STATUS, RECORD_MODE } from '@/constants';
import useEmitter, { EDeviceEmitter } from '@/hooks/useEmitter';
import { useIsRecording } from '@/hooks/useIsRecording';
import useKeyboard from '@/hooks/useKeyboard';
import { TAB_BAR_HEIGHT } from '@/navigators/AppNavigator';
import { navigationRef } from '@/navigators/refs';
import { useAppSelector } from '@/stores';
import { indicateHostStyle, ViewIndicateHost } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { sortParticipantByHostHelper } from '@/utils/array';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { ImageComponent } from '../ImageComponent';
import { TextComponent } from '../TextComponent';

const BannerInCall = () => {
  const isRecording = useIsRecording();
  const [state, setState] = useState({
    seconds: '00',
    minutes: '00',
    hours: '00',
  });
  const { status: keyboardStatus } = useKeyboard();
  const tabActive = useAppSelector(rootState => rootState.commonState.tabActive);
  const roomDetail = useAppSelector(rootState => rootState.recordState.roomDetail);

  const bottomTabHeight = TAB_BAR_HEIGHT;
  const RenderTitle = React.useMemo(() => {
    if (roomDetail?.status === CONVERSATION_STATUS.SCHEDULED) {
      return 'Connected';
    }

    if (roomDetail?.status === CONVERSATION_STATUS.RECORDING) {
      return `Recording • ${state.hours}:${state.minutes}:${state.seconds}`;
    }

    if (roomDetail?.status === CONVERSATION_STATUS.PAUSED) {
      return `Paused • ${state.hours}:${state.minutes}:${state.seconds}`;
    }

    return '';
  }, [roomDetail, state]);

  const RenderParticipantMini = React.useMemo(() => {
    return (
      <>
        {sortParticipantByHostHelper(roomDetail?.participants || []).map(participant => (
          <View style={styles.miniImageContainer} key={participant.id}>
            <ViewIndicateHost width={scale(45)}>
              <ImageComponent
                uri={participant?.user?.avatar || ''}
                width={scale(45)}
                height={scale(45)}
                borderRadius={scale(45)}
              />
              {participant.isHost && <View style={indicateHostStyle} />}
            </ViewIndicateHost>
          </View>
        ))}
      </>
    );
  }, [roomDetail]);

  const RenderParticipantMiniSolo = React.useMemo(() => {
    return (
      <>
        {sortParticipantByHostHelper(roomDetail?.participants || []).map(participant => (
          <View style={styles.miniImageContainer} key={participant.id}>
            <ViewIndicateHost width={scale(80)}>
              <ImageComponent
                uri={participant?.user?.avatar || ''}
                width={scale(80)}
                height={scale(80)}
                borderRadius={scale(80)}
              />
              {participant.isHost && <View style={indicateHostStyle} />}
            </ViewIndicateHost>
          </View>
        ))}
      </>
    );
  }, [roomDetail]);

  const _returnCall = React.useCallback(() => {
    navigationRef?.current?.navigate(APP_NAVIGATION.CREATE);
  }, []);

  const wrapperStyle = useMemo(
    () =>
      tabActive === 'CHAT'
        ? {
            width: '100%',
            height: keyboardStatus ? 0 : 'auto',
          }
        : {
            position: 'absolute',
            width: '100%',
            bottom: bottomTabHeight,
            zIndex: 5,
            elevation: 5,
            height: keyboardStatus ? 0 : 'auto',
          },
    [bottomTabHeight, tabActive, keyboardStatus],
  );

  useEffect(() => {
    if (!roomDetail) {
      setState({
        seconds: '00',
        minutes: '00',
        hours: '00',
      });
    }
  }, [roomDetail]);

  useEmitter(EDeviceEmitter.SHARE_TIMER, (params: any) => {
    setState(params);
  });

  return isRecording ? (
    <View style={wrapperStyle as any}>
      <TouchableOpacity
        style={[
          styles.viewTouch,
          {
            backgroundColor:
              roomDetail?.status === CONVERSATION_STATUS.RECORDING ? Colors.Vivid_red : Colors.Background,
          },
        ]}
        onPress={_returnCall}
        activeOpacity={1}>
        <View style={styles.miniImageContainerGroup}>
          {roomDetail?.mode === RECORD_MODE.FRIENDS ? RenderParticipantMini : RenderParticipantMiniSolo}
        </View>
        <View style={styles.miniSecondView}>
          <View style={styles.miniSecondTopView}>
            <TextComponent style={styles.miniTitleText} numberOfLines={1}>
              Touch to return to call
            </TextComponent>
            <TextComponent style={styles.miniDuraion} numberOfLines={1}>
              {RenderTitle}
            </TextComponent>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  viewTouch: {
    backgroundColor: Colors.White,
    height: scale(120),
    flexDirection: 'row',
    paddingHorizontal: scale(6),
    paddingTop: scale(12),
    paddingBottom: scale(18),
    borderTopWidth: scale(1),
    borderBottomWidth: scale(1),
    borderTopColor: Colors.greyOpacity,
  },
  miniImageContainerGroup: { flexDirection: 'row', flexWrap: 'wrap', width: scale(120) },
  miniImageContainer: { marginLeft: scale(10), marginBottom: scale(10) },
  miniSecondView: { marginLeft: scale(10), justifyContent: 'space-between' },
  miniSecondTopView: { alignItems: 'center', marginTop: scale(-5) },
  miniTitleText: { fontSize: scale(18), width: '100%', color: Colors.White },
  miniDuraion: { fontSize: scale(14), width: '100%', color: Colors.White, marginTop: scale(5) },
  miniSoloImage: { width: scale(80), height: scale(80), borderRadius: scale(80) },
  miniImage: { width: scale(45), height: scale(45), borderRadius: scale(45) },
});

export default BannerInCall;
