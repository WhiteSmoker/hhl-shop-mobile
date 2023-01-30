import { chatController } from '@/controllers/chat.controller';
import { SOCKET_CHAT_EVENT, socketChat } from '@/networking/SocketChat';
import { IUserInfo, useAppDispatch, useAppSelector } from '@/stores';
import { chatSlice, commentSlice } from '@/stores/reducers';
import { fetchUser } from '@/stores/thunks/auth.thunk';
import { fetchListRoom } from '@/stores/thunks/chat.thunk';
import { IRoomChat, MessageChat } from '@/stores/types/chat.type';
import { IComment } from '@/stores/types/comment.type';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useAuth } from './useAuth';

const useSocketChat = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAuth();
  const detailRoom = useAppSelector(rootState => rootState.chatState.detailRoom);
  const listRoom = useAppSelector(rootState => rootState.chatState.rooms);
  const detailRoomRef = React.useRef<IRoomChat>();
  const listRoomRef = React.useRef<IRoomChat[]>([]);

  const handleSeenMsg = React.useCallback(
    async (data: MessageChat) => {
      if (detailRoomRef.current && detailRoomRef.current?.id === data.roomId) {
        await chatController.seeMessage(data.roomId, data.id);
      }
      if (!listRoomRef.current.find(room => room.id === data.roomId)) {
        dispatch(fetchListRoom({}));
      }
    },
    [dispatch],
  );

  const connectSocketChat = async () => {
    socketChat.off(SOCKET_CHAT_EVENT.CONNECT);
    socketChat.socket?.disconnect();
    socketChat.socket?.close();
    socketChat.connect();
    socketChat.on(SOCKET_CHAT_EVENT.DISCONNECT, reason => {
      console.log(`disconnect`, reason);
      console.log(`SOCKET_EVENT.DISCONNECT, socketChat connect:`, socketChat.socket?.connected);
    });

    socketChat.on(SOCKET_CHAT_EVENT.CONNECT_ERROR, error => {
      console.log(error, `connect_error`);
      console.log(`error, socketChat connect:`, socketChat.socket?.connected);
    });

    socketChat.on(SOCKET_CHAT_EVENT.ERROR, error => {
      console.log(`connect_error, socketChat connect:`, socketChat.socket?.connected);
      console.log(`error`, error);
    });

    socketChat.on(SOCKET_CHAT_EVENT.CONNECT, () => {
      console.log(`SOCKET_EVENT.CONNECT, socketChat connect:`, socketChat.socket?.connected, userInfo?.id);
      socketChat.emit('join', userInfo);
    });

    socketChat.on(SOCKET_CHAT_EVENT.RECEIVED, (data: MessageChat) => {
      console.log('SOCKET_CHAT_EVENT.RECEIVED', data);
      dispatch(chatSlice.actions.appendMessage(data));
      dispatch(chatSlice.actions.updateUnread({ data, myId: userInfo?.id }));

      handleSeenMsg(data);
    });
    socketChat.on(SOCKET_CHAT_EVENT.SEEN, (data: { userId: number; lastMsgId: number; roomId: number }) => {
      console.log('SOCKET_CHAT_EVENT.MESSAGE_SEEN', data);
      dispatch(chatSlice.actions.updateLastMsgId({ ...data, myId: userInfo?.id }));
    });

    socketChat.on(SOCKET_CHAT_EVENT.REACTED, (data: { likedBy: IUserInfo[]; messageId: number }) => {
      console.log('SOCKET_CHAT_EVENT.REACTED', data);
      dispatch(chatSlice.actions.countLikeMessage(data));
    });

    socketChat.on(SOCKET_CHAT_EVENT.BLOCK_STATUS_CHANGED, (data: any) => {
      if (data) {
        dispatch(fetchUser(false));
      }
    });

    socketChat.on(SOCKET_CHAT_EVENT.DONE_MANUAL_UPLOAD, () => {
      console.log('DONE_MANUAL_UPLOAD');

      Toast.show({
        type: 'success',
        text1: 'Your Stump is ready. You can publish now!',
      });
    });

    socketChat.on(SOCKET_CHAT_EVENT.COMMENT_RECEIVED, (data: IComment) => {
      if (data.type === 'MEDIA') {
        dispatch(commentSlice.actions.updateResReplyComment({ ...data, user: userInfo }));
      }
    });
  };

  useEffect(() => {
    detailRoomRef.current = detailRoom;
  }, [detailRoom]);
  useEffect(() => {
    listRoomRef.current = listRoom;
  }, [listRoom]);

  useEffect(() => {
    connectSocketChat();
    return () => {
      socketChat.socket?.close();
    };
  }, []);

  return { connectSocketChat };
};

export default useSocketChat;
