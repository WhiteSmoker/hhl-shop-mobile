import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GiftedChat } from 'react-native-gifted-chat';

import unionBy from 'lodash/unionBy';
import { IRoomChat, ITempMessage, MessageChat } from '../types/chat.type';
import { isValidIndex } from '@/utils/typeChecks';
interface ChatSliceState {
  rooms: IRoomChat[];
  detailRoom?: IRoomChat;
  messages: ITempMessage[];
}
const initialChatState: ChatSliceState = {
  rooms: [],
  messages: [],
};
export const chatSlice = createSlice({
  name: 'chat-slice',
  initialState: initialChatState,
  reducers: {
    setConversationChat: (state: ChatSliceState, action: PayloadAction<IRoomChat[]>) => {
      return {
        ...state,
        rooms: action.payload,
      };
    },
    setMessages: (
      state: ChatSliceState,
      action: PayloadAction<{ data: IRoomChat; isLoadMore: boolean; myId: number }>,
    ) => {
      const membersInRoom = [...(action.payload.data?.members || [])];
      const messages: ITempMessage[] = action.payload.data?.messages.map(msg => {
        const sender = membersInRoom.filter(mem => mem.id === msg.senderId);
        return {
          _id: msg.id,
          text: '',
          [msg.type.toLowerCase()]: msg.message,
          thumbnail: msg.thumbnail,
          user: {
            _id: msg.senderId,
            name: `${sender[0]?.firstName} ${sender[0]?.lastName}`,
            avatar: sender[0]?.avatar,
          },
          createdAt: msg.createdAt,
          pending: false,
          received: true,
          seenUsers: membersInRoom.filter(e => e.id !== action.payload.myId && e.lastMsgId && msg.id === e.lastMsgId),
          likedBy: msg.likedBy || 0,
        };
      });
      return {
        ...state,
        detailRoom: action.payload.data,
        messages: action.payload.isLoadMore
          ? unionBy(GiftedChat.append(messages, state.messages), '_id')
          : [...messages],
      };
    },
    appendMessage: (state: ChatSliceState, action: PayloadAction<MessageChat>) => {
      const cloneRooms = JSON.parse(JSON.stringify(state.rooms)) as IRoomChat[];
      const idxRoomId = cloneRooms.findIndex(room => room.id === action.payload.roomId);
      let sortRooms = cloneRooms;
      if (isValidIndex(idxRoomId)) {
        cloneRooms[idxRoomId] = {
          ...cloneRooms[idxRoomId],
          messages: [action.payload],
          reading: !!state.detailRoom,
        };
        sortRooms = [...cloneRooms.splice(idxRoomId, 1), ...cloneRooms];
      }
      if (state.detailRoom && state.detailRoom.id === action.payload.roomId) {
        const membersInRoom = [...(state.detailRoom?.members || [])];
        const sender = membersInRoom.filter(mem => mem.id === action.payload.senderId);
        const pendingIdx = [...state.messages].findIndex(msg => msg._id === action.payload._id);
        const newMessage: ITempMessage = {
          _id: action.payload.id,
          text: '',
          [action.payload.type.toLowerCase()]: action.payload.message,
          thumbnail: action.payload.thumbnail || '',
          user: {
            _id: action.payload.senderId,
            name: `${sender[0]?.firstName} ${sender[0]?.lastName}`,
            avatar: sender[0]?.avatar,
          },
          createdAt: action.payload.createdAt,
        };
        if (isValidIndex(pendingIdx)) {
          const cloneMsgs = JSON.parse(JSON.stringify(state.messages)) as ITempMessage[];
          const newMessagePending: ITempMessage = {
            ...cloneMsgs[pendingIdx],
            _id: action.payload.id,
            text: '',
            user: {
              _id: action.payload.senderId,
              name: `${sender[0]?.firstName} ${sender[0]?.lastName}`,
              avatar: sender[0]?.avatar,
            },
            createdAt: action.payload.createdAt,
            pending: false,
          };
          if (action.payload.type === 'TEXT') {
            Object.assign(newMessagePending, { text: action.payload.message });
          }
          cloneMsgs[pendingIdx] = newMessagePending;
          return {
            ...state,
            messages: cloneMsgs,
            rooms: sortRooms,
          };
        } else {
          return {
            ...state,
            messages: unionBy(GiftedChat.append(state.messages, [newMessage]), '_id'),
            rooms: sortRooms,
          };
        }
      } else {
        return { ...state, rooms: sortRooms };
      }
    },
    appendMessagePending: (state: ChatSliceState, action: PayloadAction<ITempMessage[]>) => {
      if (state.detailRoom) {
        return {
          ...state,
          messages: unionBy(GiftedChat.append(state.messages, action.payload), '_id'),
        };
      } else {
        return { ...state };
      }
    },
    updateTypeRoom: (state: ChatSliceState, action: PayloadAction<number>) => ({
      ...state,
      rooms: state.rooms.map(room => {
        if (room.id === action.payload) {
          return { ...room, type: 'CHAT' as any };
        } else {
          return { ...room };
        }
      }),
    }),
    deleteRoom: (state: ChatSliceState, action: PayloadAction<number>) => ({
      ...state,
      rooms: state.rooms.filter(room => room.id !== action.payload),
    }),
    updateLastMsgId: (
      state: ChatSliceState,
      action: PayloadAction<{ userId: number; lastMsgId: number; myId: number; roomId: number }>,
    ) => {
      if (state.detailRoom && state.detailRoom.id === action.payload.roomId) {
        const members = state.detailRoom?.members.map(mem => ({
          ...mem,
          lastMsgId: action.payload.userId === mem.id ? action.payload.lastMsgId : mem.lastMsgId,
        }));
        return {
          ...state,
          detailRoom: { ...state.detailRoom, members },
          messages: unionBy(
            state.messages.map(msg => ({
              ...msg,
              seenUsers: members.filter(e => e.id !== action.payload.myId && e.lastMsgId && msg._id === e.lastMsgId),
            })),
            '_id',
          ),
        };
      } else {
        return state;
      }
    },
    updateUnread: (state: ChatSliceState, action: PayloadAction<{ data: MessageChat; myId: number }>) => {
      if (!state.detailRoom || state.detailRoom?.id !== action.payload.data.roomId) {
        return state;
      }

      const cloneRooms = JSON.parse(JSON.stringify(state.rooms)) as IRoomChat[];
      const idxRoomUpdate = cloneRooms.findIndex(room => room.id === action.payload.data.roomId);
      if (isValidIndex(idxRoomUpdate)) {
        const updatedLastMsgMembers = cloneRooms[idxRoomUpdate].members.map(mem => {
          if (mem.id === action.payload.myId) {
            return { ...mem, lastMsgId: action.payload.data.id };
          }
          return mem;
        });
        cloneRooms[idxRoomUpdate] = { ...cloneRooms[idxRoomUpdate], members: updatedLastMsgMembers };
      }
      return {
        ...state,
        rooms: cloneRooms,
      };
    },
    countLikeMessage: (state: ChatSliceState, action: PayloadAction<{ likedBy: IUserInfo[]; messageId: number }>) => {
      if (!state.detailRoom) {
        return { ...state };
      }
      const cloneMsgs = JSON.parse(JSON.stringify(state.messages)) as ITempMessage[];
      const idx = cloneMsgs.findIndex(msg => msg._id === action.payload.messageId);
      if (isValidIndex(idx)) {
        cloneMsgs[idx] = { ...cloneMsgs[idx], likedBy: action.payload.likedBy };
      }
      return { ...state, messages: cloneMsgs };
    },
    changeNameRoom: (state: ChatSliceState, action: PayloadAction<{ roomId: number; name: string }>) => {
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id === action.payload.roomId) {
            return { ...room, name: action.payload.name };
          }
          return room;
        }),
        detailRoom: state.detailRoom ? { ...state.detailRoom, name: action.payload.name } : undefined,
      };
    },
    chatSliceClear: (state: ChatSliceState) => ({
      ...state,
      detailRoom: undefined,
      messages: [],
    }),
  },
});
