import { chatController } from '@/controllers/chat.controller';
import { ASYNC_STORE, storage } from '@/storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { chatSlice } from '../reducers';
import { TRoomType } from '../types/chat.type';

export const fetchListRoom = createAsyncThunk('chat/fetchListRoom', async ({ onSuccess }: any, thunkAPI) => {
  try {
    const res = await chatController.getAllRoomChat();
    thunkAPI.dispatch(chatSlice.actions.setConversationChat(res.data));
  } catch (error: any) {
    console.log(error);
  } finally {
    if (onSuccess) {
      onSuccess();
    }
  }
});

interface IFetchDetailRoomParams {
  roomId: number;
  type: TRoomType;
  onSuccess: (total: number) => void;
}
export const fetchDetailRoom = createAsyncThunk(
  'chat/fetchDetailRoom',
  async (params: IFetchDetailRoomParams, thunkAPI) => {
    try {
      const res = await chatController.getDetailRoomChat(params?.roomId, 1);
      const myId = (await storage.getItem(ASYNC_STORE.MY_USER_ID)) || 0;
      const lastMsg = res.data.messages[0];
      thunkAPI.dispatch(chatSlice.actions.setMessages({ data: res.data, isLoadMore: false, myId: Number(myId) }));
      if (params.type !== 'MESSAGE_REQUESTS' && lastMsg) {
        await chatController.seeMessage(res.data.id, lastMsg.id || 0);
        thunkAPI.dispatch(chatSlice.actions.updateUnread({ data: lastMsg, myId: Number(myId) }));
      }
      params.onSuccess(res.data.totalMessages || 0);
    } catch (error: any) {
      console.log(error, 'fsfsf');
    }
  },
);

interface ILoadMoreMessageParams {
  roomId: number;
  pageNumber: number;
  onSuccess: () => void;
}

export const loadMessages = createAsyncThunk('chat/loadMessages', async (params: ILoadMoreMessageParams, thunkAPI) => {
  try {
    const res = await chatController.getDetailRoomChat(params.roomId, params.pageNumber);
    const myId = (await storage.getItem(ASYNC_STORE.MY_USER_ID)) || 0;
    thunkAPI.dispatch(chatSlice.actions.setMessages({ data: res.data, isLoadMore: true, myId: Number(myId) }));
    params.onSuccess();
  } catch (error: any) {
    console.log(error);
  }
});
