import chunk from 'lodash/chunk';
import { SupportedChainId } from 'config/sdk-core';
import {ERC20_ABI, STAKING_MANAFER_ABI} from 'config/abis';
import { multicallv2 } from 'packages/multicall/utils';
import { SerializedFarmPoolConfig, PoolBaseSerialized } from '../types';

const fetchFarmCalls = (manager: string, pool: any) => {
  const { tokenStake, token0, token1, rewards } = pool;
  return [
    // Balance of token in the LP contract
    {
      address: token0,
      name: 'balanceOf',
      params: [tokenStake],
    },
    // Balance of quote token on LP contract
    {
      address: token1,
      name: 'balanceOf',
      params: [tokenStake],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: tokenStake,
      name: 'balanceOf',
      params: [manager],
    },
    // Total supply of LP tokens
    {
      address: tokenStake,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: tokenStake,
      name: 'decimals',
    },
    {
      address: token0,
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: token1,
      name: 'decimals',
    },
    {
      address: rewards,
      name: 'symbol',
    },
    {
      address: token0,
      name: 'symbol',
    },
    {
      address: token1,
      name: 'symbol',
    },
    {
      address: token0,
      name: 'name',
    },
    {
      address: token1,
      name: 'name',
    },
  ];
};

export const fetchPublicFarmsData = async (
  pools: any[] = [],
  chainId: SupportedChainId = SupportedChainId.MAINNET,
): Promise<any[]> => {
  try {
    const calls = pools.flatMap((pool) => fetchFarmCalls(pool.manager, pool));
    const chunkSize = calls.length / pools.length;
    const farmMultiCallResult = await multicallv2({ abi: ERC20_ABI, calls, chainId });

    return chunk(farmMultiCallResult, chunkSize);
  } catch (error) {
    console.error('MasterChef Public Data error ', error);
    throw error;
  }
};