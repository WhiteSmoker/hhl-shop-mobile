import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStump = createAsyncThunk('stump/softStump', async ({ onSuccess }: any, thunkAPI) => {
  try {
    // const res = await chatController.getAllRoomChat();
    // thunkAPI.dispatch(setConversationChat(res.data));
  } catch (error: any) {
    console.log(error);
  } finally {
    if (onSuccess) {
      onSuccess();
    }
  }
});
