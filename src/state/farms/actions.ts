import { stringify } from 'querystring';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { chainIdSupportedFarms } from 'config/constants/chains';
import {SupportedChainId, SupportedNetwork} from 'config/sdk-core';
import { fetchFarms } from 'packages/farms/fetchFarms';
import {
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmsUserInfos,
} from 'packages/farms/fetchFarmsUser';
import {
  FarmSortOptionEnum,
  SerializedFarm,
  FarmUserDataResponse,
  SerializedFarmPoolConfig,
  SerializedFarmBase,
} from 'packages/farms/types';
import { generateFarmPoolConfig } from 'packages/farms/utils';
import getFarmsPrices from 'packages/farms/utils/getFarmsPrices';

import { RootState } from 'state/store';
import { fetchFarmBaseData } from 'packages/farms/fetchFarms/fetchFarmBase';
import { getFarmPoolsInfo } from 'utils/tokens';
import BigNumber from 'bignumber.js';
import { BIG_ZERO } from 'config/constants/number';

export const updateFarmQuery = createAction<string>('user/updateFarmQuery');
export const updateFarmSort = createAction<FarmSortOptionEnum>('user/updateFarmSort');

export const updateLoadingFarmData = createAction<boolean>('user/updateLoadingFarmData');

export const fetchFarmsPublicDataAsync = createAsyncThunk<
  { farms: any[]; chainId: SupportedChainId },
  { account: string; chainId: SupportedChainId },
  {
    state: RootState;
  }
>(
  'farms/fetchFarmsPublicDataAsync',
  async ({ account, chainId }) => {
    try {
      if (!chainIdSupportedFarms(chainId))
        return {
          farms: [],
          chainId: null,
        };

      const farmPoolsInfo = await getFarmPoolsInfo(SupportedNetwork[chainId]);
        const parseFarmPool = generateFarmPoolConfig(farmPoolsInfo).filter((pool) => pool.manager.toLowerCase() !== '0x8a459Eff1D03589D479E0A459b1256c1eAa7865A'.toLowerCase());
      console.log('====================farm pool info: ', farmPoolsInfo, parseFarmPool)

      const farmsData = await fetchFarms({ farms: parseFarmPool, chainId });
      const poolsWithPricesAndApr = farmsData?.map((pool) => {
          if (pool.apr) {
              return {
                  ...pool,
              }
          }

          let apr = '0%';
          const totalRewardPricePerYear = new BigNumber(pool.priceReward).multipliedBy(new BigNumber(pool.rewardPerBlock).dividedBy(new BigNumber(10).exponentiatedBy(pool.decimal)).multipliedBy(5).multipliedBy(60).multipliedBy(24).multipliedBy(365));
          const totalStakingTokenInPool = pool.lpStakedTotal ? new BigNumber(pool.price).multipliedBy(pool.lpStakedTotal) : BIG_ZERO;
          apr = totalStakingTokenInPool.lt(0) ? `${totalRewardPricePerYear.dividedBy(totalStakingTokenInPool).multipliedBy(100).toString()}%` : '0%';

          return {
              ...pool,
              apr
          }
      });

      const userFarmAllowances = await fetchFarmUserAllowances(account, parseFarmPool, chainId);
      const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, parseFarmPool, chainId);
      const userInfos = await fetchFarmsUserInfos(account, parseFarmPool, chainId);

      const poolsWithUserData = poolsWithPricesAndApr.map((pool, index) => {
         const [userStakedBalance, userLockTime, userFarmEarning] = userInfos[index];
         return {
             ...pool,
             userData: {
                 allowance: userFarmAllowances[index],
                 tokenBalance: userFarmTokenBalances[index],
                 stakedBalance: userStakedBalance,
                 earnings: userFarmEarning,
             }
         }
      });
        
      return {
        farms: poolsWithUserData,
        chainId,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  {
    condition: () => {
      return true;
    },
  },
);

export const clearFarmUserDataAsync = createAction('farms/clearFarmUserDataAsync');