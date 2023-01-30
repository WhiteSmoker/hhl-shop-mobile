import { stumpController } from '@/controllers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { stumpSlice } from '../reducers';
import { TFieldStumpTab } from '@/stores';

//get page 1 stump profile
// export const fetchListStumpProfile = createAsyncThunk(
//   'profile/created',
//   async ({ url, field }: { url: string; field: TFieldStumpTab }, thunkAPI) => {
//     try {
//       const res = await stumpController.getListStumpProfile({ url, pageNumber: 1, userId: null });
//       if (res.status === 1) {
//         const data = [...res.data.stumps];
//         thunkAPI.dispatch(stumpSlice.actions.setListStump({ [field]: data }));
//         thunkAPI.dispatch(stumpSlice.actions.setCountStump({ [field]: res.data.count || 0 }));
//       }
//     } catch (error: any) {
//       console.log(error);
//     }
//   },
// );
