import { RECORD_MODE } from '@/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CountryCode } from 'react-native-country-picker-modal';
import { Participant } from '../types';
import { Conversation } from '../types/record.type';

export type RecordState = {
  recordMode: number;
  stumpNow: boolean;
  role: 'participant' | 'host';
  inviteCode: string;
  joinStatus?: any;
  start_time: number;
  roomDetail?: Conversation;
  participantToEmit?: Participant[];
  stoped: boolean;
  rescheduled?: Conversation;
  countryCode: CountryCode;
  duration: number;
  recordingScreen: string;
  postId?: number;
  matchId?: number;
  sportId?: number;
  leagueId?: number;
  teamId?: number;
  marketId?: number;
};

const initialCreateStumpState: RecordState = {
  recordMode: RECORD_MODE.SOLO,
  stumpNow: true,
  role: 'participant',
  inviteCode: '',
  start_time: 0,
  stoped: false,
  countryCode: 'US',
  duration: 0,
  recordingScreen: '',
};
export const recordSlice = createSlice({
  name: 'record-slice',
  initialState: initialCreateStumpState,
  reducers: {
    setConfig: (state: RecordState, action: PayloadAction<any>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeStatusRoomDetail: (state: RecordState, action: PayloadAction<number>) => {
      //payload Stump
      return {
        ...state,
        roomDetail: { ...state.roomDetail!, status: action.payload },
      };
    },
  },
});
