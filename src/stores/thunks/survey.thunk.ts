import { userController } from '@/controllers/user.controller';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setListLeague, setListMarket, setListSport, setListTeam, setUserSurveyInfo } from '../reducers';

export const fetchListSport = createAsyncThunk('survey/sport', async (_, thunkAPI) => {
  try {
    const sports = await userController.getSports();
    thunkAPI.dispatch(setListSport(sports));
  } catch (error) {
    console.log(error);
  }
});

export const fetchListLeague = createAsyncThunk('survey/league', async (_, thunkAPI) => {
  try {
    const leagues = await userController.getLeagues();
    thunkAPI.dispatch(setListLeague(leagues));
  } catch (error) {
    console.log(error);
  }
});

export const fetchListMarket = createAsyncThunk('survey/market', async (_, thunkAPI) => {
  try {
    const markets = await userController.getMarkets();
    thunkAPI.dispatch(setListMarket(markets));
  } catch (error) {
    console.log(error);
  }
});

export const fetchListTeam = createAsyncThunk('survey/league/id', async (id: number[], thunkAPI) => {
  try {
    const listTeam = await Promise.all([...id].map(x => userController.getTeams(x))).then(res => res);
    thunkAPI.dispatch(setListTeam(listTeam));
  } catch (error) {
    console.log(error);
  }
});

export const updateUserSurvey = createAsyncThunk('user/updateUserSurvey', async (payload: any) => {
  try {
    await userController.updateUserSurvey(payload.payload);
    payload.onSuccess();
  } catch (error) {
    console.log(error);
  }
});

export const fetchUserSurveyInfo = createAsyncThunk('user/userSurveyInfo', async (_, thunkAPI) => {
  try {
    const userInfo = await userController.userSurveyInfo();
    thunkAPI.dispatch(setUserSurveyInfo(userInfo));
  } catch (error) {
    console.log(error);
  }
});
