import { socketChatURL } from '@/networking/config';
import { io, Socket } from 'socket.io-client';

class SocketChat {
  public socket: Socket | null;
  constructor() {
    this.socket = null;
  }
  connect(query?: string) {
    this.socket = io(`${socketChatURL}`, { forceNew: true });
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

export const socketChat = new SocketChat();

export enum SOCKET_CHAT_EVENT {
  ERROR = 'error',
  CONNECT_ERROR = 'connect_error',
  DISCONNECT = 'disconnect',
  CONNECT = 'connect',
  RECONNECT = 'reconnect',
  JOIN = 'join',
  RECEIVED = 'received',
  MESSAGE_CREATED = 'messageCreated',
  SEEN = 'seen',
  REACTED = 'reacted',
  ROOM_COUNT = 'roomCount',
  BLOCK_STATUS_CHANGED = 'blockStatusChanged',
  DONE_MANUAL_UPLOAD = 'doneManualUpload',
  COMMENT_RECEIVED = 'commentReceived',
}
