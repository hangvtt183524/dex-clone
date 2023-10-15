import BigNumber from 'bignumber.js';
import { multicallv2 } from 'packages/multicall/utils';
import { ERC20_ABI, STAKING_MANAFER_ABI } from 'config/abis';
import { SupportedChainId } from 'config/sdk-core';
import { chunk } from 'lodash';
import { PoolBaseSerialized, SerializedFarmPoolConfig } from '../types';

export const fetchFarmUserAllowances = async (
  account: string,
  pools: any[],
  chainId: SupportedChainId,
) => {
  const calls = pools.flatMap((pool) => ({
    address: pool.tokenStake,
    name: 'allowance',
    params: [account, pool.manager],
  }));

  const rawLpAllowances = await multicallv2<BigNumber[]>({
    abi: ERC20_ABI,
    calls,
    chainId,
  });

  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (
  account: string,
  pools: any[],
  chainId: SupportedChainId,
) => {
  const calls = pools.flatMap((pool) => ({
    address: pool.tokenStake,
    name: 'balanceOf',
    params: [account],
  }));

  const rawTokenBalances = await multicallv2<BigNumber[]>({
    abi: ERC20_ABI,
    calls,
    chainId,
  });

  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

const fetchUserCalls = (manager: string, pool: any, account: string) => {
  return [
    {
      address: manager,
      name: 'userInfo',
      params: [pool.poolId, account],
    },
    {
      address: manager,
      name: 'getRewardHarvest',
      params: [pool.poolId, account],
    },
  ];
};

/*
  return 
  [
    userStakedBalance : total user staked,
    pending rewards : rewards are pending,
    locktime : next time can be withdraw
  ]
*/
export const fetchFarmsUserInfos = async (
  account: string,
  pools: any[],
  chainId: SupportedChainId,
): Promise<[string, string, string][]> => {
  try {
    const calls = pools.flatMap((pool) => fetchUserCalls(pool.manager, pool, account));

    const chunkSize = calls.length / pools.length;
    const farmMultiCallResult = await multicallv2({ abi: STAKING_MANAFER_ABI, calls, chainId });
    const results = chunk(farmMultiCallResult, chunkSize);
    return results.map((result: any[]) => {
      const [userInfo, pendingReward] = result;
      const userStakedBalance = new BigNumber(userInfo.amount.toString()).toJSON();
      const userLockTime = new BigNumber(userInfo.expireTime.toString()).multipliedBy(1000).toJSON();

      const userPendingRewards = new BigNumber(pendingReward.toString()).toJSON();

      return [userStakedBalance, userLockTime, userPendingRewards];
    });
  } catch (error) {
    console.error('Farm User Info Data error ', error);
    throw error;
  }
};
