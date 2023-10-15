import BigNumber from 'bignumber.js';
import { STAKING_MANAFER_ABI } from 'config/abis';
import { SupportedChainId } from 'config/sdk-core';
import { multicallv2 } from 'packages/multicall/utils';
import { SerializedFarmBase } from '../types';

const poolLenghtStakingManagerCalls = (farms: SerializedFarmBase[]) => {
  return farms.map((farm) => ({
    name: 'getPoolLength',
    address: farm.manager,
    params: [],
  }));
};

export const fetchStakingManagerPoolLength = async (
  farms: SerializedFarmBase[] = [],
  chainId: SupportedChainId = SupportedChainId.MAINNET,
): Promise<BigNumber[]> => {
  try {
    const calls = poolLenghtStakingManagerCalls(farms);

    const poolLengths = await multicallv2({
      abi: STAKING_MANAFER_ABI,
      calls,
      chainId,
    });

    return poolLengths;
  } catch (error) {
    console.error('Fetch MasterChef Farm Pool Length Error: ', error);
    return [];
  }
};
