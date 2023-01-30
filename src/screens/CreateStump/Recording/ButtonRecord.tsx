import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Animated, Dimensions, Platform, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { BigTextStyled, styles, TextInputStyled, TouchStartStyled, ViewEmpty, ViewFunctionStyled } from './styles';
import { SOCKET_RECORD_EVENT, socketRecord } from '@/networking/SocketRecord';
import {
  APP_NAVIGATION,
  CONVERSATION_STATUS,
  HOME_NAVIGATION,
  RECORD_MODE,
  RECORD_NAVIGATION,
  SCHEDULE_MODE,
} from '@/constants';
import { Colors } from '@/theme/colors';
import { commonStyles, insets } from '@/styles/common';
import useKeyboard from '@/hooks/useKeyboard';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/stores';
import { scale } from 'react-native-size-scaling';
import { convertTimeToUTC } from '@/utils/format';
import DateTimePicker from '@/containers/components/DateTimePicker';
import { IconClock } from '@/assets/icons/Icon';
import useEmitter, { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { recordSlice } from '@/stores/reducers';
type Props = {
  role: string;
  conversationId: number;
  leave(): void;
  navigation: any;
  mode: number;
};

type State = {
  modeDateTime?: 'date' | 'time';
  estimateTime: Date;
};
const ButtonRecord = (props: Props) => {
  const userInfo = useAuth();
  const { status: keyboardStatus } = useKeyboard();
  const roomDetail = useAppSelector(rootState => rootState.recordState.roomDetail);
  const heightConsume = useAppSelector(rootState => rootState.commonState.heightConsume);
  const [isPlayAudio, setPlayAudio] = useState(false);
  const dispatch = useAppDispatch();
  const dingRef = React.useRef<Video | null>(null);

  const { control, handleSubmit } = useForm<{ message: string }>();
  const [state, setState] = useState<State>({
    estimateTime: new Date(),
    modeDateTime: 'date',
  });

  const scheduleYAnim = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEmitter(EDeviceEmitter.RECORD_PLAY_VIDEO, (isPlay: boolean) => {
    setPlayAudio(isPlay);
  });

  useEmitter(EDeviceEmitter.RECORD_SCHEDULER_LATER, () => {
    if (props.role === 'host') {
      Animated.timing(scheduleYAnim, {
        toValue: Dimensions.get('window').height,
        useNativeDriver: true,
        duration: 250,
      }).start(endCallback => {
        if (endCallback.finished) {
          props.navigation.navigate(RECORD_NAVIGATION.FIRST_STEP);
          props.navigation.navigate(APP_NAVIGATION.HOME, { screen: HOME_NAVIGATION.SCHEDULEDHOME, initial: false });
        }
      });
    } else {
      props.leave();
    }
  });

  const _startRecording = React.useCallback(
    (type: 'resuming' | 'starting') => () => {
      socketRecord.emit(SOCKET_RECORD_EVENT.START, props.conversationId);
      if (type === 'resuming') {
        dispatch(recordSlice.actions.changeStatusRoomDetail(CONVERSATION_STATUS.RESUMING));
      } else {
        dispatch(recordSlice.actions.changeStatusRoomDetail(CONVERSATION_STATUS.STARTING));
      }
    },
    [dispatch, props.conversationId],
  );

  const _pauseRecording = React.useCallback(() => {
    if (props.role === 'host') {
      emitter(EDeviceEmitter.EVENT_CLICK_PAUSE);
    }
  }, [props.role]);

  const _stopRecording = React.useCallback(() => {
    socketRecord.emit(SOCKET_RECORD_EVENT.STOP, { channel: props.conversationId, isPause: false });
  }, [props.conversationId]);

  const _leave = React.useCallback(() => {
    props.leave();
  }, [props]);

  const _openSchedule = React.useCallback(() => {
    Animated.timing(scheduleYAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 250,
    }).start();
  }, [scheduleYAnim]);

  const _closeSchedule = React.useCallback(() => {
    Animated.timing(scheduleYAnim, {
      toValue: Dimensions.get('window').height,
      useNativeDriver: true,
      duration: 250,
    }).start();
  }, [scheduleYAnim]);

  const RenderButtonHost = useMemo(() => {
    if (
      roomDetail!.status === CONVERSATION_STATUS.SCHEDULED ||
      (roomDetail!.status === CONVERSATION_STATUS.RESCHEDULED && !roomDetail!.duration)
    ) {
      return (
        <ViewFunctionStyled>
          <TouchStartStyled onPress={_startRecording('starting')}>
            <BigTextStyled color={Colors.White}>START RECORDING</BigTextStyled>
          </TouchStartStyled>
          <TouchStartStyled style={{ backgroundColor: Colors.Light_Gray }} onPress={_leave}>
            <BigTextStyled color={Colors.White}>LEAVE</BigTextStyled>
          </TouchStartStyled>
        </ViewFunctionStyled>
      );
    }
    if (roomDetail!.status === CONVERSATION_STATUS.RECORDING) {
      return (
        <ViewFunctionStyled>
          <ViewEmpty />
          <TouchStartStyled style={{ backgroundColor: Colors.Vivid_red }} onPress={_pauseRecording}>
            <BigTextStyled color={Colors.White}>PAUSE/STOP</BigTextStyled>
          </TouchStartStyled>
        </ViewFunctionStyled>
      );
    }
    if (roomDetail!.status === CONVERSATION_STATUS.PAUSED || roomDetail!.status === CONVERSATION_STATUS.RESCHEDULED) {
      return (
        <ViewFunctionStyled>
          {props.mode === RECORD_MODE.FRIENDS && (
            <TouchableOpacity style={styles.absoluteClock} onPress={_openSchedule}>
              <IconClock fill={Colors.Dark_Gray1} width={scale(35)} height={scale(35)} />
            </TouchableOpacity>
          )}
          <TouchStartStyled
            style={{ backgroundColor: Colors.Background }}
            onPress={_startRecording('resuming')}
            activeOpacity={0.7}>
            <BigTextStyled color={Colors.White}>RESUME</BigTextStyled>
          </TouchStartStyled>

          <TouchStartStyled style={{ backgroundColor: Colors.Light_Gray }} onPress={_stopRecording}>
            <BigTextStyled color={Colors.Black}>SAVE</BigTextStyled>
          </TouchStartStyled>
        </ViewFunctionStyled>
      );
    }
    if (roomDetail!.status === CONVERSATION_STATUS.STARTING) {
      return (
        <ViewFunctionStyled>
          <TouchStartStyled
            style={{ backgroundColor: Colors.Background, flexDirection: 'row' }}
            disabled={true}
            activeOpacity={0.7}>
            <ActivityIndicator color={Colors.White} size={scale(16)} style={{ marginRight: scale(4) }} />
            <BigTextStyled color={Colors.White}>START RECORDING</BigTextStyled>
          </TouchStartStyled>
          <TouchStartStyled style={{ backgroundColor: Colors.Light_Gray }} onPress={_leave}>
            <BigTextStyled color={Colors.White}>LEAVE</BigTextStyled>
          </TouchStartStyled>
        </ViewFunctionStyled>
      );
    }
    if (roomDetail!.status === CONVERSATION_STATUS.UPLOADING) {
      return (
        <ViewFunctionStyled>
          <TouchStartStyled
            style={{ backgroundColor: Colors.Background, flexDirection: 'row' }}
            disabled={true}
            activeOpacity={0.7}>
            <ActivityIndicator color={Colors.White} size={scale(16)} style={{ marginRight: scale(4) }} />
            <BigTextStyled color={Colors.White}>UPLOADING</BigTextStyled>
          </TouchStartStyled>
          <TouchStartStyled style={{ backgroundColor: Colors.Light_Gray }} onPress={_leave}>
            <BigTextStyled color={Colors.White}>LEAVE</BigTextStyled>
          </TouchStartStyled>
        </ViewFunctionStyled>
      );
    }
    return (
      <ViewFunctionStyled>
        {props.mode === RECORD_MODE.FRIENDS && (
          <TouchableOpacity style={styles.absoluteClock} onPress={_openSchedule}>
            <IconClock fill={Colors.Dark_Gray1} width={scale(35)} height={scale(35)} />
          </TouchableOpacity>
        )}
        <TouchStartStyled
          style={{ backgroundColor: Colors.Background, flexDirection: 'row' }}
          disabled={true}
          activeOpacity={0.7}>
          <ActivityIndicator color={Colors.White} size={scale(16)} style={{ marginRight: scale(4) }} />
          <BigTextStyled color={Colors.White}>RESUME</BigTextStyled>
        </TouchStartStyled>

        <TouchStartStyled style={{ backgroundColor: Colors.Light_Gray }} onPress={_stopRecording}>
          <BigTextStyled color={Colors.Black}>SAVE</BigTextStyled>
        </TouchStartStyled>
      </ViewFunctionStyled>
    );
  }, [_leave, _openSchedule, _pauseRecording, _startRecording, _stopRecording, props.mode, roomDetail]);

  const _onChangeDate = React.useCallback((selectDate: Date, mode?: 'date' | 'time') => {
    setState(preState => ({ ...preState, estimateTime: selectDate, modeDateTime: mode === 'date' ? 'time' : 'date' }));
  }, []);

  const _reschedule = React.useCallback(
    async (data: { message: string }) => {
      try {
        socketRecord.emit(SOCKET_RECORD_EVENT.EDIT_CONVERSATION, {
          data: {
            scheduledStart: convertTimeToUTC(state.estimateTime),
            scheduleMode: SCHEDULE_MODE.SCHEDULE,
            message: data.message,
            id: props.conversationId,
            email: userInfo?.email || '',
          },
        });
      } catch (error: any) {
        console.log(error);
      }
    },
    [props.conversationId, state.estimateTime, userInfo?.email],
  );

  const AnimatedViewSchedule = React.useMemo(() => {
    return (
      <Animated.View
        style={[
          styles.aniViewSchedule,
          {
            justifyContent: Platform.OS === 'android' && keyboardStatus ? 'flex-end' : 'center',
            paddingBottom: Platform.OS === 'ios' && keyboardStatus ? scale(100) : 0,
            height: heightConsume, //scale(90) === height of header
            transform: [{ translateY: scheduleYAnim }],
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 1.0,
          },
        ]}>
        <View style={[styles.viewSchedule, { height: heightConsume * 0.6 }]}>
          <TouchableOpacity style={commonStyles.selfEnd} onPress={_closeSchedule} hitSlop={insets}>
            <Icon name="close-outline" size={scale(22)} color={Colors.dark} />
          </TouchableOpacity>
          <BigTextStyled color={Colors.Black}>RESCHEDULE</BigTextStyled>
          <DateTimePicker
            label="Select a date"
            value={state.estimateTime}
            onChangeDate={_onChangeDate}
            mode={state.modeDateTime}
            containerStyle={styles.shadowInput}
          />
          <View style={styles.shadowInput}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputStyled
                  multiline={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder={'Enter your message here…'}
                />
              )}
              name="message"
              defaultValue={''}
            />
          </View>
          <TouchStartStyled onPress={handleSubmit(_reschedule)}>
            <BigTextStyled color={Colors.White}>RE-SCHEDULE</BigTextStyled>
          </TouchStartStyled>
        </View>
      </Animated.View>
    );
  }, [
    keyboardStatus,
    heightConsume,
    scheduleYAnim,
    _closeSchedule,
    state.estimateTime,
    state.modeDateTime,
    _onChangeDate,
    control,
    handleSubmit,
    _reschedule,
  ]);

  const _onEnd = () => {
    emitter(EDeviceEmitter.RECORD_PLAY_VIDEO, false);
  };

  return (
    <>
      {isPlayAudio ? (
        <Video
          ref={dingRef}
          source={require('@/assets/sound/ding-stump.wav')}
          rate={1}
          volume={1}
          repeat={false}
          playWhenInactive={true}
          playInBackground={true}
          ignoreSilentSwitch={'ignore'}
          resizeMode={'contain'}
          maxBitRate={500000}
          onEnd={_onEnd}
          paused={!isPlayAudio}
        />
      ) : null}
      {props.role === 'host' ? (
        <>
          {RenderButtonHost}
          {AnimatedViewSchedule}
        </>
      ) : (
        <ViewFunctionStyled>
          <TouchStartStyled
            onPress={_leave}
            style={{
              backgroundColor:
                roomDetail!.status === CONVERSATION_STATUS.RECORDING ? Colors.Vivid_red : Colors.Background,
            }}>
            <BigTextStyled color={Colors.White}>LEAVE</BigTextStyled>
          </TouchStartStyled>
        </ViewFunctionStyled>
      )}
    </>
  );
};

export default React.memo(ButtonRecord);
