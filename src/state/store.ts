import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';

import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import appReducer from './app/reducer';
import blockReducer from './block';
import burnReducer from './burn/reducer';
import farmsReducer from './farms/reducer';
import mintReducer from './mint/reducer';
import multicallReducer from './multicall/reducer';
import { routingApi } from './routing/slice';
import swapReducer from './swap/reducer';
import transactionsReducer from './transactions/reducer';
import userReducer from './user/reducer';

const PERSISTED_KEYS: string[] = ['transactions', 'user', 'lists'];

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    app: appReducer,
    block: blockReducer,

    user: userReducer,
    swap: swapReducer,
    mint: mintReducer,
    transactions: transactionsReducer,
    multicall: multicallReducer,
    burn: burnReducer,
    // farmsV1: farmsV1Reducer,
    farms: farmsReducer,
    [routingApi.reducerPath]: routingApi.reducer,
  }),
);

// eslint-disable-next-line import/no-mutable-exports
let store: ReturnType<typeof makeStore> | undefined;

const makeStore = (preloadedState = undefined) =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(routingApi.middleware),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  });

export const initializeStore = (preloadedState: RootState = undefined) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;

  return _store;
};

store = initializeStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);

export const useStore = (initialState: any) => useMemo(() => initializeStore(initialState), [initialState]);

export default store;
