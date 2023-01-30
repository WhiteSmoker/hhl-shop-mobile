import { conversationController } from '@/controllers/conversation.controller';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { counterSlice } from '../reducers';
import { userController } from '@/controllers/user.controller';

export const getNumberConversation = createAsyncThunk('common/getConversationNumber', async (_, thunkAPI) => {
  try {
    const res_number = await conversationController.getConversationNumber();
    if (res_number.status === 1) {
      thunkAPI.dispatch(
        counterSlice.actions.setCounter({
          count: res_number.data.scheduledCount || 0,
          countDraft: res_number.data.draftCount || 0,
          countAccepted: res_number.data.acceptedCount || 0,
        }),
      );
    }
  } catch (error: any) {
    console.log(error);
  }
});

export const getCountNewNotification = createAsyncThunk('common/getCountNewNotification', async (_, thunkAPI) => {
  try {
    const res = await userController.allNewNotis();
    if (res.status === 1) {
      thunkAPI.dispatch(counterSlice.actions.setCountNewNotification(res.data || 0));
    }
  } catch (error: any) {
    console.log(error);
  }
});
