import { SupportedChainId } from 'config/sdk-core';
import { getFarmsByChain } from 'packages/farms/utils';

export const findFarmByManagerAddress = (value: string, chainId: SupportedChainId) => {
  return getFarmsByChain(chainId)?.find((farm) => farm.manager === value);
};

export const findFarmByManagerAddressAndPid = (pools = [], manager: string, pid: number) => {
    return pools.find((pool) => pool.manager.toLowerCase() === manager.toLowerCase() && pool.poolId === pid);
}