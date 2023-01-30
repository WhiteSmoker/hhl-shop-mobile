import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILeagueRespone, IMarketResponse, ISportResponse, ITeamResponse, IUserSurveyInfo } from '../types/survey.type';

interface InitialState {
  listSport: ISportResponse;
  listLeague: ILeagueRespone;
  listMarket: IMarketResponse;
  listTeam: ITeamResponse[];
  selectedSport?: number[];
  selectedLeague?: number[];
  userSurveyInfo?: IUserSurveyInfo;
}

const initialState: InitialState = {
  listSport: { status: 0, data: [] },
  listLeague: { status: 0, data: [] },
  listMarket: { status: 0, data: [] },
  listTeam: [],
  selectedSport: [],
  selectedLeague: [],
};

export const surveySlice = createSlice({
  name: 'survey-slice',
  initialState,
  reducers: {
    setListSport(state: InitialState, action: PayloadAction<any>) {
      state.listSport = action.payload;
    },
    setListLeague(state: InitialState, action: PayloadAction<any>) {
      state.listLeague = action.payload;
    },
    setListMarket(state: InitialState, action: PayloadAction<any>) {
      state.listMarket = action.payload;
    },
    setListTeam(state: InitialState, action: PayloadAction<any>) {
      state.listTeam = action.payload;
    },
    setEmptyListTeam(state: InitialState, action: PayloadAction<any>) {
      state.listTeam = [];
    },
    setEmptyList(state: InitialState, action: PayloadAction<any>) {
      state.listTeam = [];
      state.listMarket = { status: 0, data: [] };
      state.listLeague = { status: 0, data: [] };
      state.listSport = { status: 0, data: [] };
    },
    setSelectedSport(state: InitialState, action: PayloadAction<any>) {
      state.selectedSport = action.payload;
    },
    setSelectedLeague(state: InitialState, action: PayloadAction<any>) {
      state.selectedLeague = action.payload;
    },
    setUserSurveyInfo(state: InitialState, action: PayloadAction<any>) {
      state.userSurveyInfo = action.payload;
    },
  },
});

export const {
  setListSport,
  setListLeague,
  setListMarket,
  setListTeam,
  setEmptyListTeam,
  setEmptyList,
  setSelectedSport,
  setSelectedLeague,
  setUserSurveyInfo,
} = surveySlice.actions;
export default surveySlice.reducer;
