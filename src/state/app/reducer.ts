import { createReducer } from '@reduxjs/toolkit';
import { setVersion } from './actions';

interface AppState {
  version: number;
}

const initialState: AppState = {
  version: Date.now(),
};

const AppReducer = createReducer<AppState>(initialState, (builder) =>
  builder.addCase(setVersion, (state, { payload }) => ({
    ...state,
    version: payload,
  })),
);

export default AppReducer;
