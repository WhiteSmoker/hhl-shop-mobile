import { useAppSelector } from '@/stores';
import { differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ITimerProps, ITimerState } from './propState';
import { TextRecordingStyled, TextTimerStyled, ViewTimerStyled } from './styles';
import { SOCKET_RECORD_EVENT, socketRecord } from '@/networking/SocketRecord';
import { Colors } from '@/theme/colors';
import { commonStyles } from '@/styles/common';
import { scale } from 'react-native-size-scaling';
import useEmitter, { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { CONVERSATION_STATUS } from '@/constants';
import { recordSlice } from '@/stores/reducers';

const TimerComponent = (props: ITimerProps) => {
  const dispatch = useDispatch();
  const { start_time, duration } = useAppSelector(rootState => ({
    start_time: rootState.recordState.start_time,
    duration: rootState.recordState.duration,
  }));
  const [state, setState] = useState<ITimerState>({
    timestamp: duration || 0,
    seconds: '00',
    minutes: '00',
    hours: '00',
  });

  const formatTimer = (time: number) => {
    let seconds: number | string = time % 60;
    // tslint:disable-next-line: no-bitwise
    let minutes: number | string = ~~((time % 3600) / 60);
    // tslint:disable-next-line: no-bitwise
    let hours: number | string = ~~(time / 3600);
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (hours < 10) {
      hours = '0' + hours;
    }
    return { seconds, minutes, hours };
  };

  useLayoutEffect(() => {
    if (!start_time) {
      return;
    }
    const interval = setInterval(() => {
      let seconds: number | string = differenceInSeconds(new Date().getTime(), start_time - duration * 1000) % 60;
      let minutes: number | string = differenceInMinutes(new Date().getTime(), start_time - duration * 1000) % 60;
      let hours: number | string = differenceInHours(new Date().getTime(), start_time - duration * 1000);

      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (hours < 10) {
        hours = '0' + hours;
      }
      setState(prevState => ({ ...prevState, minutes, seconds, hours }));
      emitter(EDeviceEmitter.SHARE_TIMER, { minutes, seconds, hours });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [start_time, duration]);

  useEmitter(
    EDeviceEmitter.EVENT_CLICK_PAUSE,
    () => {
      if (props.role === 'host') {
        const new_duration = duration + (new Date().getTime() - start_time - 300) / 1000;
        dispatch(recordSlice.actions.changeStatusRoomDetail(CONVERSATION_STATUS.PAUSED));
        dispatch(
          recordSlice.actions.setConfig({
            start_time: 0,
          }),
        );
        socketRecord.emit(SOCKET_RECORD_EVENT.STOP, {
          channel: props.conversationId,
          isPause: true,
          duration: new_duration,
        });
      }
    },
    [start_time, duration],
  );

  useEffect(() => {
    if (duration) {
      // tslint:disable-next-line: no-bitwise
      const { seconds, minutes, hours } = formatTimer(~~duration);
      setState(prevState => ({ ...prevState, minutes, seconds, hours }));
      emitter(EDeviceEmitter.SHARE_TIMER, { minutes, seconds, hours });
    }
  }, [duration]);

  const handleUserJoinedEvent = (uid: number, elapsed: number) => {
    console.log('UserJoined', uid, elapsed);
    setState(prevState => ({ ...prevState, userJoin: { uid, elapsed } }));
  };

  useEffect(() => {
    if (state.userJoin && start_time) {
      socketRecord.emit(SOCKET_RECORD_EVENT.JOIN_RECORDING, {
        channelName: props.conversationId,
        id: state.userJoin.uid,
        duration: duration + (new Date().getTime() - start_time + 500) / 1000,
      });
    }
  }, [state.userJoin]);

  useEffect(() => {
    if (props.engine && props.role === 'host') {
      props.engine.addListener('UserJoined', (uid, elapsed) => handleUserJoinedEvent(uid, elapsed));
    }
  }, [props.engine]);
  return (
    <ViewTimerStyled color={!start_time ? Colors.Background : Colors.Vivid_red}>
      <TextTimerStyled>
        {state.hours}:{state.minutes}:{state.seconds}
      </TextTimerStyled>
      {start_time ? (
        <View style={[commonStyles.flexRow, commonStyles.containerView]}>
          <View
            style={{
              width: scale(10),
              height: scale(10),
              borderRadius: scale(10),
              backgroundColor: Number(state.seconds) % 2 ? Colors.Vivid_red : 'transparent',
              marginRight: scale(6),
            }}
          />
          <TextRecordingStyled>RECORDING</TextRecordingStyled>
        </View>
      ) : (
        <View
          style={{
            height: scale(10),
          }}
        />
      )}
    </ViewTimerStyled>
  );
};

export default React.memo(TimerComponent);
