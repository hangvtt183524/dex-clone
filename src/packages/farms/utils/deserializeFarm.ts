import BigNumber from 'bignumber.js';
import { BIG_ZERO } from 'config/constants/number';
import { Token } from 'config/sdk-core';
import { findFarmByManagerAddress } from 'utils/farms';
import { deserializeToken } from 'utils/tokens';
import { DeserializedFarm, SerializedFarm } from '../types';
import { deserializeFarmUserData } from './deserializeFarmUserData';

export const deserializeFarm = (farm: any): any => {
  return {
    ...farm,
    fee: farm.fee ? farm.fee : 0,
    token: farm.token0 && farm.tokenDecimals ? new Token(farm.chainId, farm.token0, farm.tokenDecimals || 0, farm.tokenSymbol, farm.tokenName) : null,
    quoteToken: farm.token1 && farm.quoteTokenDecimals ? new Token(farm.chainId, farm.token1, farm.quoteTokenDecimals || 0, farm.quoteTokenSymbol, farm.quoteTokenName) : null,
    userData: deserializeFarmUserData(farm),
    tokenAmountTotal: farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO,
    quoteTokenAmountTotal: farm.quoteTokenAmountTotal ? new BigNumber(farm.quoteTokenAmountTotal) : BIG_ZERO,
    lpTotalInQuoteToken: farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO,
    lpTotalSupply: farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO,
    tokenPriceVsQuote: farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO,
  };
};
