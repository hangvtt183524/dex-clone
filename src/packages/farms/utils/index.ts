import { SupportedChainId } from 'config/sdk-core';
import { FARMS } from '../configs/config';
import { SerializedFarmBase, SerializedFarmPoolConfig } from '../types';

export const getFarmsByChain = (chainId: SupportedChainId): SerializedFarmBase[] => FARMS[chainId];
export const generateFarmPoolConfig = (farms: any[]): any[] =>
  farms.reduce((state, farm) => {
    farm.pools.forEach((pool) => {
      state.push({
        ...pool,
        manager: farm.contractManager,
        rewards: farm.rewards,
        apr: farm.apr,
        decimal: farm.decimal,
        priceReward: farm.priceReward,
        rewardPerBlock: farm.rewardPerBlock
      });
    });
    return state;
  }, []);
