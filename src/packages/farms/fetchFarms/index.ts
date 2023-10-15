import BigNumber from 'bignumber.js';
import { BIG_TEN, BIG_ZERO } from 'config/constants/number';
import { FetchFarmsParams, SerializedFarmPublicData } from '../types';

import { fetchPublicFarmsData } from './fetchPublicFarmsData';
import { fetchStakingManagersData } from './fetchStakingManagersData';
import { REWARDS_PRECISION } from '../configs/const';

export const fetchFarms = async (
  params: Pick<any, 'chainId' | 'farms'>,
): Promise<any[]> => {
  const { farms, chainId } = params;
  const farmResult = await fetchPublicFarmsData(farms, chainId);
  // const stakingManagersResult = await fetchStakingManagersData(farms, chainId);
  return farms.map((farm, index) => {
    const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, lpTokenDecimals, tokenDecimals, quoteTokenDecimals, rewardSymbol, tokenSymbol, quoteTokenSymbol, tokenName, quoteTokenName] =
      farmResult[index];

    // const [apr, locktime, fee] = stakingManagersResult[index];

    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply));

    // Raw amount of token in the LP, including those not staked
    const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals));
    const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals));

    // Amount of quoteToken in the LP that are staked in the MC
    const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio);

    // Total staked in LP, in quote token value
    const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2));

    const allocPoint = new BigNumber(1000) || BIG_ZERO;
    // const poolWeight = apr ? new BigNumber(apr).dividedBy(REWARDS_PRECISION) : BIG_ZERO;
    //
    // const parseFee = fee ? new BigNumber(fee).toNumber() : 0;
    const lpSymbol = `${tokenSymbol}-${quoteTokenSymbol}`

    return {
      ...farm,
      tokenAmountTotal: tokenAmountTotal.toJSON(),
      lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
      multiplier: `${allocPoint.div(100).toString()}X`, // WAITING,
      lpStakedTotal: new BigNumber(lpTokenBalanceMC).toJSON(),
      rewardSymbol: rewardSymbol[0],
      tokenSymbol: tokenSymbol[0],
      quoteTokenSymbol: quoteTokenSymbol[0],
      tokenName: tokenName[0],
      quoteTokenName: quoteTokenName[0],
      lpTokenDecimals: lpTokenDecimals[0],
      tokenDecimals: tokenDecimals[0],
      quoteTokenDecimals: quoteTokenDecimals[0],
      lpSymbol
    };
  });
};
