import { FixedNumber } from 'ethers';
import { SerializedFarmPublicData } from '../types';
import { FIXED_ONE, FIXED_ZERO } from '../configs/const';

export const getFarmQuoteTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  nativePriceUSD: FixedNumber,
  wNative: string,
  stable: string,
): FixedNumber => {
  if (farm.quoteToken.symbol === stable) {
    return FIXED_ONE;
  }

  if (farm.quoteToken.symbol === wNative) {
    return nativePriceUSD;
  }

  if (!quoteTokenFarm) {
    return FIXED_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === wNative) {
    return quoteTokenFarm.tokenPriceVsQuote
      ? nativePriceUSD.mulUnsafe(FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote))
      : FIXED_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === stable) {
    return quoteTokenFarm.tokenPriceVsQuote ? FixedNumber.from(quoteTokenFarm.tokenPriceVsQuote) : FIXED_ZERO;
  }

  return FIXED_ZERO;
};
