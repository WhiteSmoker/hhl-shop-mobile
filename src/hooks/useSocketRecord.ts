/* eslint-disable no-bitwise */
import { CONVERSATION_STATUS } from '@/constants';
import { SOCKET_RECORD_EVENT, socketRecord } from '@/networking';
import { useAppDispatch, useAppSelector } from '@/stores';
import { recordSlice } from '@/stores/reducers';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { EDeviceEmitter, emitter } from './useEmitter';

const useSocketRecord = () => {
  const dispatch = useAppDispatch();
  const role = useAppSelector(rootState => rootState.recordState.role);
  useEffect(() => {
    //initial socket
    connectSocket();
    return () => {
      socketRecord.socket?.close();
    };
  }, []);

  const handleStartedEvent = (data: any) => {
    dispatch(recordSlice.actions.changeStatusRoomDetail(CONVERSATION_STATUS.RECORDING));
    if (role === 'host') {
      dispatch(recordSlice.actions.setConfig({ start_time: new Date().getTime() }));
      dispatch(getNumberConversation());
    } else if (data.duration) {
      dispatch(recordSlice.actions.setConfig({ start_time: new Date().getTime(), duration: ~~data.duration || 0 }));
    } else {
      dispatch(recordSlice.actions.setConfig({ start_time: new Date().getTime() }));
    }
  };

  const connectSocket = async () => {
    socketRecord.off(SOCKET_RECORD_EVENT.CONNECT);
    socketRecord.socket?.close();
    socketRecord.connect();
    socketRecord.on(SOCKET_RECORD_EVENT.DISCONNECT, reason => {
      console.log(`disconnect`, reason);
      console.log(`SOCKET_RECORD_EVENT.DISCONNECT, socket connect:`, socketRecord.socket?.connected);
      // dispatch(setSocketConnected(socketRecord.socket?.connected));
    });

    socketRecord.on(SOCKET_RECORD_EVENT.CONNECT_ERROR, error => {
      console.log(error, `connect_error`);
      console.log(`error, socket connect:`, socketRecord.socket?.connected);
    });

    socketRecord.on(SOCKET_RECORD_EVENT.ERROR, error => {
      console.log(`connect_error, socket connect:`, socketRecord.socket?.connected);
      console.log(`error`, error);
    });

    socketRecord.on(SOCKET_RECORD_EVENT.CONNECT, () => {
      console.log(`SOCKET_RECORD_EVENT.CONNECT, socket connect:`, socketRecord.socket?.connected);
      // dispatch(setSocketConnected(socketRecord.socket?.connected));
    });

    socketRecord.on(SOCKET_RECORD_EVENT.JOINED, data => {
      //event participant join
      console.log(`joinedjoined`, data);
      dispatch(recordSlice.actions.setConfig({ joinStatus: data }));
    });

    socketRecord.on(SOCKET_RECORD_EVENT.LEFT, data => {
      //event participant left
      console.log(`leftleft`, data);
      dispatch(recordSlice.actions.setConfig({ joinStatus: data }));
    });
    socketRecord.on(SOCKET_RECORD_EVENT.STARTED, data => {
      // event start call record
      console.log(`startedstarted`, data);
      if (data) {
        handleStartedEvent(data);
      }
    });

    socketRecord.on(SOCKET_RECORD_EVENT.STOPED, data => {
      // event end call record
      console.log(`stopedstoped`, data);
      if (data) {
        socketRecord.emit(SOCKET_RECORD_EVENT.LEAVE, null);
        dispatch(recordSlice.actions.setConfig({ start_time: 0, stoped: true }));
        Toast.show({
          type: 'success',
          text1: 'Your Stump is ready. You can publish now!',
        });
        emitter(EDeviceEmitter.FETCH_DATA_DRAFT);
        dispatch(recordSlice.actions.changeStatusRoomDetail(CONVERSATION_STATUS.FINISHED));
      }
    });

    socketRecord.on(SOCKET_RECORD_EVENT.USER_EDIT_CONVERSATION, data => {
      // event reschedule record
      console.log(`userEditCovensation`, data);
      if (data) {
        socketRecord.emit(SOCKET_RECORD_EVENT.LEAVE, null);
        dispatch(recordSlice.actions.changeStatusRoomDetail(CONVERSATION_STATUS.RESCHEDULED));
        dispatch(recordSlice.actions.setConfig({ start_time: 0 }));
        emitter(EDeviceEmitter.RECORD_SCHEDULER_LATER);
        emitter(EDeviceEmitter.FETCH_DATA_DRAFT);
        emitter(EDeviceEmitter.FETCH_DATA_SCHEDULE);
        dispatch(getNumberConversation());
      }
    });

    socketRecord.on(SOCKET_RECORD_EVENT.END_RECORD, data => {
      console.log(`end_recordend_record`, data);
      if (data) {
        dispatch(recordSlice.actions.changeStatusRoomDetail(CONVERSATION_STATUS.UPLOADING));
        dispatch(recordSlice.actions.setConfig({ start_time: 0 }));
      }
    });

    socketRecord.on(SOCKET_RECORD_EVENT.PAUSED, data => {
      //event pause record
      console.log(`pausedpaused`, data);
      if (data) {
        dispatch(recordSlice.actions.changeStatusRoomDetail(CONVERSATION_STATUS.PAUSED));
        emitter(EDeviceEmitter.RECORD_PLAY_VIDEO, true);
        dispatch(
          recordSlice.actions.setConfig({
            start_time: 0,
            duration: ~~data.duration || 0,
          }),
        );
      }
    });

    socketRecord.on(SOCKET_RECORD_EVENT.NEW_CONVERSATION_DETAIL, data => {
      //event New_Conversation_Detail
      console.log(`New_Conversation_Detail`, data);
      if (data) {
        dispatch(recordSlice.actions.setConfig({ roomDetail: data[0] }));
      }
    });
  };

  return { connectSocket };
};

export default useSocketRecord;
