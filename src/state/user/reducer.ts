import { createReducer } from '@reduxjs/toolkit';
import { DEFAULT_DEADLINE_FROM_NOW, GAS_PRICE_GWEI, INITIAL_ALLOWED_SLIPPAGE } from 'config/constants';
import { set } from 'lodash';
import { updateVersion } from '../global/actions';
import {
    addSerializedPair,
    addSerializedToken,
    removeSerializedPair,
    removeSerializedToken,
    updateGasPrice,
    updateUserDeadline,
    updateUserExpertMode,
    updateUserSingleHopOnly,
    updateUserSlippageTolerance,
    updateUserExpertModeAcknowledgementShow,
    setIsExchangeChartDisplayed,
    setChartViewMode,
    ChartViewMode,
    addWatchlistToken,
    updatePinToken,
    updateTokensImport,
    FarmStakedOnly,
    updateUserFarmStakedOnly,
    updateUserClientSideRouter,
    setSelectedChainNetwork,
} from './actions';
import { UserState } from './types';

const currentTimestamp = () => new Date().getTime();

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`;
}

const initialState: UserState = {
  userExpertMode: false,
  userClientSideRouter: false,
  userSingleHopOnly: false,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  userFarmStakedOnly: FarmStakedOnly.ON_FINISHED,
  tokens: {},
  tokensImported: {},
  pairs: {},
  pinTokens: {},
  timestamp: currentTimestamp(),
  isExchangeChartDisplayed: true,
  isSubgraphHealthIndicatorDisplayed: false,
  userChartViewMode: ChartViewMode.BASIC,
  userExpertModeAcknowledgementShow: true,

  gasPrice: GAS_PRICE_GWEI.default.toString(),
  watchlistTokens: [],
  chainNetwork: undefined,
};

const userReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      // slippage is'nt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE;
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW;
      }

      state.lastUpdateVersionTimestamp = currentTimestamp();
    })
    .addCase(updateUserFarmStakedOnly, (state, { payload: { userFarmStakedOnly } }) => {
      state.userFarmStakedOnly = userFarmStakedOnly;
    })

    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode;
      state.timestamp = currentTimestamp();
    })
    .addCase(updatePinToken, (state, { payload: { currencyId, isPin, chainId } }) => {
      set(state, `pinTokens[${chainId}][${currencyId}]`, isPin);
      return state;
    })
    .addCase(updateTokensImport, (state, { payload: { account, tokenAddress, chainId } }) => {
      set(state, `tokensImported[${chainId}][${account}][${tokenAddress}]`, true);
      return state;
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline;
      state.timestamp = currentTimestamp();
    })
    .addCase(updateUserSingleHopOnly, (state, action) => {
      state.userSingleHopOnly = action.payload.userSingleHopOnly;
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      if (!state.tokens) {
        state.tokens = {};
      }
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {};
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken;
      state.timestamp = currentTimestamp();
    })
    .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
      if (!state.tokens) {
        state.tokens = {};
      }
      state.tokens[chainId] = state.tokens[chainId] || {};
      delete state.tokens[chainId][address];
      state.timestamp = currentTimestamp();
    })
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const { chainId } = serializedPair.token0;
        state.pairs[chainId] = state.pairs[chainId] || {};
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair;
      }
      state.timestamp = currentTimestamp();
    })
    .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)];
        delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)];
      }
      state.timestamp = currentTimestamp();
    })

    .addCase(updateUserExpertModeAcknowledgementShow, (state, { payload: { userExpertModeAcknowledgementShow } }) => {
      state.userExpertModeAcknowledgementShow = userExpertModeAcknowledgementShow;
    })

    .addCase(updateGasPrice, (state, action) => {
      state.gasPrice = action.payload.gasPrice;
    })
    .addCase(addWatchlistToken, (state, { payload: { address } }) => {
      // state.watchlistTokens can be undefined for pre-loaded localstorage user state
      const tokenWatchlist = state.watchlistTokens ?? [];
      if (!tokenWatchlist.includes(address)) {
        state.watchlistTokens = [...tokenWatchlist, address];
      } else {
        // Remove token from watchlist
        const newTokens = state.watchlistTokens.filter((x) => x !== address);
        state.watchlistTokens = newTokens;
      }
    })
    .addCase(setIsExchangeChartDisplayed, (state, { payload }) => {
      state.isExchangeChartDisplayed = payload;
    })
    .addCase(updateUserClientSideRouter, (state, { payload: { userClientSideRouter } }) => {
      state.userClientSideRouter = userClientSideRouter;
    })
    .addCase(setChartViewMode, (state, { payload }) => {
      state.userChartViewMode = payload;
    })
    .addCase(setSelectedChainNetwork, (state, { payload }) => {
        state.chainNetwork = payload;
    }),
);
export default userReducer;
