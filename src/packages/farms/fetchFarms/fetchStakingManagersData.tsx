import { STAKING_MANAFER_ABI } from 'config/abis';
import { chunk } from 'lodash';
import { multicallv2 } from 'packages/multicall/utils';
import { SupportedChainId } from 'config/sdk-core';
import { PoolBaseSerialized, SerializedFarmPoolConfig } from '../types';

const fetchStakingManagerData = (manager: string, pool: any) => {
  return manager
    ? [
        {
          address: manager,
          name: 'getAPR',
          params: [pool.poolId], // PID
        },
        {
          address: manager,
          name: 'getLockTime',
          params: [pool.poolId],
        },
        {
          address: manager,
          name: 'getPoolHarvestFee',
          params: [pool.poolId],
        },
      ]
    : [null, null];
};

export const fetchStakingManagersData = async (
  pools: SerializedFarmPoolConfig[] = [],
  chainId: SupportedChainId = SupportedChainId.MAINNET,
): Promise<any[]> => {
  const calls = pools.flatMap((pool) => fetchStakingManagerData(pool.manager, pool));

  const chunkSize = calls.flat().length / pools.length;
  const stakingManagerAggregatedCalls = calls
    .filter((stakingManagerCall) => stakingManagerCall[0] !== null && stakingManagerCall[1] !== null)
    .flat();
  const stakingManagerMultiCallResult = await multicallv2({
    abi: STAKING_MANAFER_ABI,
    calls: stakingManagerAggregatedCalls,
    chainId,
  });
  const stakingManagerChunkedResultRaw = chunk(stakingManagerMultiCallResult, chunkSize);
  let stakingManagerChunkedResultCounter = 0;
  return calls.map((stakingManagerCall) => {
    if (stakingManagerCall[0] === null && stakingManagerCall[1] === null) {
      return [null, null];
    }
    const data = stakingManagerChunkedResultRaw[stakingManagerChunkedResultCounter];
    stakingManagerChunkedResultCounter++;
    return data;
  });
};
