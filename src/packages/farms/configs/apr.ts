import BigNumber from 'bignumber.js';
import { FarmWithPrices } from '../types';

// copy from src/config, should merge them later
const BSC_BLOCK_TIME = 3;
const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365; // 10512000

const FIXED_ZERO = new BigNumber(0);
const FIXED_100 = new BigNumber(100);

export const getFarmCakeRewardApr = (
  farm: FarmWithPrices,
  cakePriceBusd: string | number,
  regularCakePerBlock: number,
) => {
  const _cakePriceBusd = new BigNumber(cakePriceBusd || 0);
  let cakeRewardsAprAsString = '0';
  if (!_cakePriceBusd) {
    return cakeRewardsAprAsString;
  }
  const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).multipliedBy(new BigNumber(farm.quoteTokenPriceBusd));

  const poolWeight = new BigNumber(farm.poolWeight);
  if (totalLiquidity.isZero() || poolWeight.isZero()) {
    return cakeRewardsAprAsString;
  }

  const yearlyCakeRewardAllocation = poolWeight
    ? poolWeight.multipliedBy(new BigNumber(BLOCKS_PER_YEAR).multipliedBy(new BigNumber(String(regularCakePerBlock))))
    : FIXED_ZERO;

  const cakeRewardsApr = yearlyCakeRewardAllocation
    .multipliedBy(_cakePriceBusd)
    .dividedBy(totalLiquidity)
    .multipliedBy(FIXED_100);

  if (!cakeRewardsApr.isZero()) {
    cakeRewardsAprAsString = cakeRewardsApr.toFixed(2);
  }
  return cakeRewardsAprAsString;
};
