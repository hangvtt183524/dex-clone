import { SerializedToken } from 'config/types/token';
import { SerializedPair, ChartViewMode, FarmStakedOnly } from './actions';

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number;

  userExpertMode: boolean;

  userClientSideRouter: boolean; // whether routes should be calculated with the client side router only

  // only allow swaps on direct pairs
  userSingleHopOnly: boolean;

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number;

  // deadline set by user in minutes, used in all txns
  userDeadline: number;

  userFarmStakedOnly: FarmStakedOnly;

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken;
    };
  };

  tokensImported: {
    [chainId: number]: {
      [account: string]: {
        [tokenAddress: string]: true;
      };
    };
  };

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair;
    };
  };

  pinTokens: {
    [chainId: number]: {
      [address: string]: boolean;
    };
  };

  timestamp: number;
  isExchangeChartDisplayed: boolean;
  isSubgraphHealthIndicatorDisplayed: boolean;
  userChartViewMode: ChartViewMode;

  userExpertModeAcknowledgementShow: boolean;
  gasPrice: string;
  watchlistTokens: string[];
  chainNetwork: number;
}
