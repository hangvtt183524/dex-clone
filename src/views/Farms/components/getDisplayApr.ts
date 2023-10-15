import { formatLocalisedCompactNumber } from 'utils/numbersHelper';

export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr > 1e6
      ? formatLocalisedCompactNumber(cakeRewardsApr)
      : cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  return null;
};
