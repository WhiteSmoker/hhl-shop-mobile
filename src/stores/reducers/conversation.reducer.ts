import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation } from '../types/record.type';

interface InitialState {
  schedule: { count: number; data: Conversation[]; maxPage: number };
  scheduleParticipatedIn: { count: number; data: Conversation[]; maxPage: number };
  draft: Conversation[];
}

const initialConversationState: InitialState = {
  draft: [],
  schedule: {
    count: 0,
    data: [],
    maxPage: 1,
  },
  scheduleParticipatedIn: {
    count: 0,
    data: [],
    maxPage: 1,
  },
};
export const conversationSlice = createSlice({
  name: 'conversation-slice',
  initialState: initialConversationState,
  reducers: {
    setListConversation: (state: InitialState, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});
