import { trendingController } from '@/controllers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setListStumpDiscovery, setListStumpMatch, setListStumpPost } from '../reducers';

export const fetchListByPost = createAsyncThunk(
  'feed/stumpByPostId',
  async (payload: { id: number; page: number }, thunkAPI) => {
    try {
      const listStump = await trendingController.getListStumpByPost(payload);
      thunkAPI.dispatch(setListStumpPost(listStump));
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetchListByMatch = createAsyncThunk(
  'feed/stumpByMatchId',
  async (payload: { id: number; page: number }, thunkAPI) => {
    try {
      const listStump = await trendingController.getListStumpByMatch(payload);
      thunkAPI.dispatch(setListStumpMatch(listStump));
    } catch (error) {
      console.log(error);
    }
  },
);

export const fetchListByDiscovery = createAsyncThunk(
  'stump/getListStump',
  async (payload: { type: string; pageNumber: number; id: number }, thunkAPI) => {
    try {
      const listStump = await trendingController.getListStumpDiscovery(payload);
      console.log('22222222222', listStump);
      thunkAPI.dispatch(setListStumpDiscovery(listStump));
    } catch (error) {
      console.log(error);
    }
  },
);

// export const fetchListByCity = createAsyncThunk(
//   'stump/getListStump',
//   async (payload: { type: string; pageNumber: number; listId: any }, thunkAPI) => {
//     try {
//       const listStump = await trendingController.getListStumpByTeam(payload);
//       console.log("listStump", listStump);
//       thunkAPI.dispatch(setListStumpCity(listStump));
//     } catch (error) {
//       console.log(error);
//     }
//   },
// );
