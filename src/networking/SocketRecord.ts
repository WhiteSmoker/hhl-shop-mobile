import { socketURL } from '@/networking/config';
import { io, Socket } from 'socket.io-client';

class SocketRecord {
  public socket: Socket | null;
  constructor() {
    this.socket = null;
  }
  connect(query?: string) {
    this.socket = io(`${socketURL}`, { forceNew: true });
  }
  on(ev: string, func: (params: any) => void) {
    this.socket?.on(ev, func);
  }
  off(ev: string) {
    this.socket?.off(ev);
  }
  emit(ev: string, data: any) {
    if (typeof this.socket?.emit === 'function') {
      this.socket?.emit(ev, data);
      console.log(`emit ${ev}:`, data);
    }
  }
}

export const socketRecord = new SocketRecord();

export enum SOCKET_RECORD_EVENT {
  ERROR = 'error',
  CONNECT_ERROR = 'connect_error',
  DISCONNECT = 'disconnect',
  CONNECT = 'connect',
  RECONNECT = 'reconnect',
  JOINED = 'joined',
  LEFT = 'left',
  STARTED = 'started',
  STOPED = 'stoped',
  PAUSED = 'paused',
  USER_EDIT_CONVERSATION = 'userEditCovensation',
  PLAY_SOUND = 'play_sound',
  END_RECORD = 'end_record',
  NEW_CONVERSATION_DETAIL = 'New_Conversation_Detail',
  //emit
  JOIN = 'join',
  LEAVE = 'leave',
  STOP = 'stop',
  START = 'start',
  stop = 'stop',
  EDIT_CONVERSATION = 'editConversation',
  UPDATE_CONVERSATION = 'update_Conversation',
  JOIN_RECORDING = 'join_recording',
}
