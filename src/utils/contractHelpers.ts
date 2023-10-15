import type { Signer } from '@ethersproject/abstract-signer';
import { Contract } from '@ethersproject/contracts';
import type { Provider } from '@ethersproject/providers';

import { Multicall } from 'config/abis/types/Multicall';
import { SupportedChainId } from 'config/sdk-core';

// Addresses
import { ERC20_ABI, MULTICALL_ABI, STAKING_MANAFER_ABI } from 'config/abis';
import { StakingManager } from 'config/abis/types';
import { Erc20 } from 'config/abis/types/Erc20';
import { provider } from 'packages/wagmi/src/wagmi';
import { getMulticall2Address } from 'utils/addressHelpers';

export const getContract = ({
  abi,
  address,
  signer,
  chainId,
}: {
  abi: any;
  address: string;
  chainId: SupportedChainId;
  signer?: Signer | Provider;
}) => {
  const signerOrProvider = signer ?? provider({ chainId });
  return new Contract(address, abi, signerOrProvider);
};

export const getBep20Contract = (address: string, signer?: Signer | Provider, chainId?: SupportedChainId) =>
  getContract({ abi: ERC20_ABI, address, signer, chainId }) as Erc20;

export const getMulticallContract = (chainId: SupportedChainId) =>
  getContract({
    abi: MULTICALL_ABI,
    address: getMulticall2Address(chainId),
    chainId,
  }) as Multicall;

export const getStakingManagerContract = (stakingManagerAddress: string, chainId: SupportedChainId) =>
  getContract({
    abi: STAKING_MANAFER_ABI,
    address: stakingManagerAddress,
    chainId,
  }) as StakingManager;
