import { createAction } from '@reduxjs/toolkit';
import { SupportedChainId } from 'config/sdk-core';

import { SerializedToken } from 'config/types/token';

export interface SerializedPair {
  token0: SerializedToken;
  token1: SerializedToken;
}

export interface GasFeeInfo {
    nativeValue: string;
    fiatValue: string;
    nativeSymbol: string;
    fiatSymbol: string;
}

export interface GasFeeType {
    [GasPriceTypes.ECONOMY]: GasFeeInfo;
    [GasPriceTypes.REGULAR]: GasFeeInfo;
    [GasPriceTypes.FAST]: GasFeeInfo;
    [GasPriceTypes.FASTEST]: GasFeeInfo;
}

export enum ViewMode {
  TABLE = 'TABLE',
  CARD = 'CARD',
}

export enum ChartViewMode {
  BASIC = 'BASIC',
  TRADING_VIEW = 'TRADING_VIEW',
}

export enum FarmStakedOnly {
  ON_FINISHED = 'onFinished',
  TRUE = 'true',
  FALSE = 'false',
}

export enum GasPriceTypes {
    ECONOMY = 'ECONOMY',
    REGULAR = 'REGULAR',
    FAST = 'FAST',
    FASTEST = 'FASTEST'
}

export const FeeDescriptions = {
    [GasPriceTypes.ECONOMY]: {
        title: 'Slow',
        description: 'Will likely go through unless activity increases',
        eta: '~ 1m',
    },
    [GasPriceTypes.REGULAR]: {
        title: 'Average',
        description: 'Will reliably go through in most scenarios',
        eta: '< 30s',
    },
    [GasPriceTypes.FAST]: {
        title: 'Fast',
        description: 'Will go through even if there is a sudden activity increase',
        eta: '< 15s',
    },
    [GasPriceTypes.FASTEST]: {
        title: 'Highest priority',
        description: 'Will go through, fast, in 99.99% of the cases',
        eta: '< 15s>',
    },
};

export const updatePinToken = createAction<{
  currencyId: string;
  isPin: boolean;
  chainId: SupportedChainId;
}>('user/updatePinToken');

export const updateTokensImport = createAction<{
  account: string;
  tokenAddress: string;
  chainId: SupportedChainId;
}>('user/updateTokensImport');

export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>('user/updateUserExpertMode');
export const updateUserSingleHopOnly = createAction<{
  userSingleHopOnly: boolean;
}>('user/updateUserSingleHopOnly');
export const updateUserFarmStakedOnly = createAction<{ userFarmStakedOnly: FarmStakedOnly }>(
  'user/updateUserFarmStakedOnly',
);
export const updateUserPoolStakedOnly = createAction<{ userPoolStakedOnly: boolean }>('user/updateUserPoolStakedOnly');
export const updateUserPoolsViewMode = createAction<{ userPoolsViewMode: ViewMode }>('user/updateUserPoolsViewMode');
export const updateUserFarmsViewMode = createAction<{ userFarmsViewMode: ViewMode }>('user/updateUserFarmsViewMode');

export const updateUserSlippageTolerance = createAction<{
  userSlippageTolerance: number;
}>('user/updateUserSlippageTolerance');

export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline');

export const addSerializedToken = createAction<{
  serializedToken: SerializedToken;
}>('user/addSerializedToken');

export const removeSerializedToken = createAction<{
  chainId: number;
  address: string;
}>('user/removeSerializedToken');

export const addSerializedPair = createAction<{
  serializedPair: SerializedPair;
}>('user/addSerializedPair');

export const removeSerializedPair = createAction<{
  chainId: number;
  tokenAAddress: string;
  tokenBAddress: string;
}>('user/removeSerializedPair');

export const addWatchlistToken = createAction<{ address: string }>('user/addWatchlistToken');

export const updateGasPrice = createAction<{ gasPrice: string }>('user/updateGasPrice');

export const setIsExchangeChartDisplayed = createAction<boolean>('user/toggleIsExchangeChartDisplayed');
export const setChartViewMode = createAction<ChartViewMode>('user/setChartViewMode');
export const setSubgraphHealthIndicatorDisplayed = createAction<boolean>('user/setSubgraphHealthIndicatorDisplayed');
export const updateUserExpertModeAcknowledgementShow = createAction<{
  userExpertModeAcknowledgementShow: boolean;
}>('user/updateUserExpertModeAcknowledgementShow');

export const updateUserClientSideRouter = createAction<{
  userClientSideRouter: boolean;
}>('user/updateUserClientSideRouter');
export const setSelectedChainNetwork = createAction<number>('user/setSelectedChainNetwork');
