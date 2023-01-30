import { validFindIndex } from '@/utils/helper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { Stump } from '../types';
import { SearchState } from '../types/search.type';

export const initialSearchState: SearchState = {
  search_stumps: {
    username: [],
    category: [],
    title: [],
  },
  default_search: {
    default: [],
  },
};

export const searchSlice = createSlice({
  name: 'home',
  initialState: initialSearchState,
  reducers: {
    refreshStumpsSearch: (state: SearchState, action: PayloadAction<any>) => {
      return {
        ...state,
        search_stumps: action.payload,
      };
    },
    setListStumpSearch: (state: SearchState, action: PayloadAction<any>) => {
      return {
        ...state,
        search_stumps: { ...state.search_stumps, ...action.payload },
      };
    },
    refreshDefaultSearch: (state: SearchState, action: PayloadAction<any>) => {
      return {
        ...state,
        default_search: action.payload,
      };
    },
    setDefaultSearch: (state: SearchState, action: PayloadAction<any>) => {
      return {
        ...state,
        default_search: { ...state.default_search, ...action.payload },
      };
    },
    unShareStumpSearch: (state: SearchState, action: PayloadAction<{ id: number; userId: number }>) => {
      const Key = ['category', 'title'];
      type KeyType = 'category' | 'title';
      const cloneState = cloneDeep(state.search_stumps);
      const cloneStateDf = cloneDeep(state.default_search);
      for (const key of Key) {
        cloneState[key as KeyType] = cloneState[key as KeyType].map((stump: Stump) => {
          if (stump.id === action.payload.id) {
            const index = stump.userShared?.findIndex((e: any) => e === action.payload.userId) || -1;
            if (validFindIndex(index)) {
              stump.userShared?.splice(index, 1);
            }
            return { ...stump, userShared: [...(stump.userShared ?? [])] };
          } else {
            return { ...stump };
          }
        });
      }
      const newDefaultSearch = cloneStateDf.default.map((e: any) => {
        const newStumps = e.stumps.map((stump: Stump) => {
          if (stump.id === action.payload.id) {
            const index = stump.userShared?.findIndex((item: any) => item === action.payload.userId) || -1;
            if (validFindIndex(index)) {
              stump.userShared?.splice(index, 1);
            }
            return { ...stump, userShared: [...(stump.userShared ?? [])] };
          } else {
            return { ...stump };
          }
        });
        return { ...e, stumps: newStumps };
      });
      return {
        ...state,
        search_stumps: { ...cloneState },
        default_search: { default: newDefaultSearch },
      };
    },
    updateStumpInSearch: (state: SearchState, action: PayloadAction<Stump>) => {
      return {
        ...state,
        search_stumps: {
          ...state.search_stumps,
          category: state.search_stumps.category.map(item => {
            if (item.id === action.payload.id) {
              return action.payload;
            } else {
              return item;
            }
          }),
          title: state.search_stumps.title.map(item => {
            if (item.id === action.payload.id) {
              return action.payload;
            } else {
              return item;
            }
          }),
        },
        default_search: {
          ...state.default_search,
          default: state.default_search.default.map(item => ({
            ...item,
            stumps: item.stumps.map(stump => {
              if (stump.id === action.payload.id) {
                return action.payload;
              } else {
                return stump;
              }
            }),
          })),
        },
      };
    },
  },
});
