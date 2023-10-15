import BigNumber from 'bignumber.js';
import { USDC, WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import { SupportedChainId } from 'config/sdk-core';
import { BIG_ONE, BIG_ZERO } from 'config/constants/number';
import { SerializedFarmPublicData } from '../types';
import { filterFarmsByQuoteToken } from './farmsPriceHelpers';

const getFarmFromTokenSymbol = (
  farms: SerializedFarmPublicData[],
  tokenSymbol: string,
  preferredQuoteTokens?: string[],
): SerializedFarmPublicData => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol);
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens);
  return filteredFarm;
};

const getFarmBaseTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  bnbPriceBusd: BigNumber,
  chainId: SupportedChainId,
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote);
  if (farm.quoteToken.symbol === USDC[chainId].symbol) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO;
  }

  if (farm.quoteToken.symbol === WRAPPED_NATIVE_CURRENCY[chainId].symbol) {
    return hasTokenPriceVsQuote ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO;
  }

  // We can only calculate profits without a quoteTokenFarm for USDC/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO;
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't USDC or WETH, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - USDC price
  if (quoteTokenFarm.quoteToken.symbol === WRAPPED_NATIVE_CURRENCY[chainId].symbol) {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote);
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === USDC[chainId].symbol) {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote;
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO;
  }

  // Catch in case token does not have immediate or once-removed USDC/WETH quoteToken
  return BIG_ZERO;
};

const getFarmQuoteTokenPrice = (
  farm: SerializedFarmPublicData,
  quoteTokenFarm: SerializedFarmPublicData,
  bnbPriceBusd: BigNumber,
): BigNumber => {
  if (farm.quoteToken.symbol === 'USDC') {
    return BIG_ONE;
  }

  if (farm.quoteToken.symbol === 'WETH') {
    return bnbPriceBusd;
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === 'WETH') {
    return quoteTokenFarm.tokenPriceVsQuote ? bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === 'USDC') {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO;
  }

  return BIG_ZERO;
};

const getFarmsPrices = (farms: SerializedFarmPublicData[], chainId: SupportedChainId) => {
  const bnbBusdFarm = farms.find((farm) => farm.token.address === USDC[chainId].address);

  const bnbPriceBusd = bnbBusdFarm?.tokenPriceVsQuote ? BIG_ONE.div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO;
  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol);
    const tokenPriceBusd = getFarmBaseTokenPrice(farm, quoteTokenFarm, bnbPriceBusd, chainId);
    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(farm, quoteTokenFarm, bnbPriceBusd);

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toJSON(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toJSON(),
    };
  });

  return farmsWithPrices;
};

export default getFarmsPrices;
