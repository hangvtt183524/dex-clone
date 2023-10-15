import { stringify } from 'querystring';
import { createSlice } from '@reduxjs/toolkit';
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers';
import { SupportedChainId } from 'config/sdk-core';
import { FarmSortOptionEnum, SerializedFarmsState } from 'packages/farms/types';
import {
  clearFarmUserDataAsync,
  fetchFarmsPublicDataAsync,
  updateFarmQuery,
  updateFarmSort,
  updateLoadingFarmData,
} from './actions';

type UnknownAsyncThunkFulfilledOrPendingAction =
  | UnknownAsyncThunkFulfilledAction
  | UnknownAsyncThunkPendingAction
  | UnknownAsyncThunkRejectedAction;

const serializeLoadingKey = (
  action: UnknownAsyncThunkFulfilledOrPendingAction,
  suffix: UnknownAsyncThunkFulfilledOrPendingAction['meta']['requestStatus'],
) => {
  const type = action.type.split(`/${suffix}`)[0];
  return stringify({
    arg: action.meta.arg as any,
    type,
  });
};

const initialState: SerializedFarmsState = {
  data: {},
  chainId: SupportedChainId.MAINNET,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
  loadingKeys: {},
  loadingFarmData: false,
  farmQuery: '',
  sortOption: FarmSortOptionEnum.LASTEST,
};

const farmsReducer = createSlice({
  name: 'Farms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateFarmQuery, (state, { payload }) => {
        state.farmQuery = payload;
      })
      .addCase(updateFarmSort, (state, { payload }) => {
        state.sortOption = payload;
      })
      .addCase(updateLoadingFarmData, (state, { payload }) => {
            state.loadingFarmData = payload;
      })
      .addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
        const { farms, chainId } = action.payload;
        state.chainId = chainId;
        state.data[chainId] = farms;
        state.userDataLoaded = true;
      })
      .addCase(clearFarmUserDataAsync, (state) => {
        state.userDataLoaded = false;
        state.data[state.chainId] = state.data[state.chainId].map((farm) => {
          return {
            ...farm,
            userData: {
              allowance: '0',
              tokenBalance: '0',
              stakedBalance: '0',
              earnings: '0',
              lockTime: '0'
            },
          };
        });
      })
  },
});

export default farmsReducer.reducer;
