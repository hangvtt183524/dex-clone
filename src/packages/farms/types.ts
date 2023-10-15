import BigNumber from 'bignumber.js';
import { SupportedChainId, Token } from 'config/sdk-core';
import { SerializedToken } from 'config/types/token';

interface PoolBase {
  poolId: number;
  lpSymbol: string;
  lpAddress: string;
  lpTokenDecimals: number;
  locktime: number;
}
export interface PoolBaseSerialized extends PoolBase {
  token: SerializedToken;
  quoteToken: SerializedToken;
}

interface PoolBaseDeserialized extends PoolBase {
  token: Token;
  quoteToken: Token;
}

interface FarmBase {
  manager: string;
  rewardPerBlock: number;
}

export type SerializedFarmBase = FarmBase & {
  rewards: string[];
  pools: PoolBaseSerialized[];
};

export type SerializedFarmPoolConfig = PoolBaseSerialized & Pick<FarmBase, 'manager'>;

export interface SerializedFarmPublicData extends SerializedFarmPoolConfig {
  lpTokenPrice?: string;
  tokenPriceBusd?: string;
  quoteTokenPriceBusd?: string;
  tokenAmountTotal?: string;
  quoteTokenAmountTotal?: string;
  lpTotalInQuoteToken?: string;
  lpTotalSupply?: string;
  lpStakedTotal?: any;
  tokenPriceVsQuote?: string;
  poolWeight?: string;
  multiplier?: string;
  fee?: number;
  lpTokenStakedAmount?: string;
  apr?: any;
}

export interface SerializedFarmUserData {
  allowance: string;
  tokenBalance: string;
  stakedBalance: string;
  earnings: string;
  lockTime: string;
}

export interface SerializedFarm extends SerializedFarmPublicData {
  userData?: SerializedFarmUserData;
}
export interface DeserializedFarmUserData {
  allowance: BigNumber;
  tokenBalance: BigNumber;
  stakedBalance: BigNumber;
  earnings: BigNumber;
  lockTime: BigNumber;
}

export interface DeserializedFarmConfig extends PoolBaseDeserialized, Pick<FarmBase, 'manager'> {}

export interface DeserializedFarm extends DeserializedFarmConfig {
  tokenPriceBusd?: string;
  quoteTokenPriceBusd?: string;
  tokenAmountTotal?: BigNumber;
  quoteTokenAmountTotal?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  lpTotalSupply?: BigNumber;
  lpTokenPrice?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  poolWeight?: BigNumber;
  userData?: DeserializedFarmUserData;
  lpTokenStakedAmount?: BigNumber;
  multiplier: string;
  fee: number;
  rewardPerBlock: number;
}

export interface DeserializedFarmsState {
  data: DeserializedFarm[];
  loadArchivedFarmsData: boolean;
  userDataLoaded: boolean;
  poolLength?: number;
}

export type FetchFarmsParams = {
  farms: SerializedFarmPoolConfig[];
  chainId: number;
};

export interface FarmWithStakedValue extends DeserializedFarm {
  rewards: string;
  apr?: number;
  liquidity?: BigNumber;
}

// Reducer
export interface FarmUserDataResponse {
  pid: number;
  manager: string;
  allowance: string;
  tokenBalance: string;
  stakedBalance: string;
  earnings: string;
  lockTime: string;
  apr: number;
}

export interface SerializedFarmsState {
  data: {
    [chainId in SupportedChainId]?: SerializedFarm[];
  };
  chainId: SupportedChainId;
  loadArchivedFarmsData: boolean;
  userDataLoaded: boolean;
  loadingKeys: Record<string, boolean>;
  loadingFarmData?: boolean;
  poolLength?: number;
  farmQuery?: string;
  sortOption?: FarmSortOptionEnum;
}

export type FarmWithPrices = SerializedFarmPublicData & {
  tokenPriceBusd: string;
  quoteTokenPriceBusd: string;
  lpTokenPrice: string;
};

export enum FarmSortOptionEnum {
  HOT = 'hot',
  APR = 'apr',
  MULTIPLIER = 'Multiplier',
  FEE = 'Fee',
  EARNED = 'earned',
  LASTEST = 'latest',
}
