import { Contract } from '@ethersproject/contracts';
import {
  EIP_2612_ABI,
  ERC20_ABI,
  ERC20_BYTES32_ABI,
  MULTICALL_ABI,
  PAIR_API,
  QUOTER_ABI,
  QUOTER_V2_ABI,
  ROUTER_V2_02_ABI,
  STAKING_MANAFER_ABI,
  WETH_ABI,
} from 'config/abis';
import { Erc20Bytes32, Pair, Quoter, QuoterV2, Weth } from 'config/abis/types';
import { Erc20 } from 'config/abis/types/Erc20';
import { Multicall } from 'config/abis/types/Multicall';
import { SupportedChainId } from 'config/sdk-core';
import { WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import { useMemo } from 'react';
import { getMulticall2Address, getQuoterAddress, getRouterV2Address } from 'utils/addressHelpers';
import { getContract } from 'utils/contractHelpers';
import {useSelectedChainNetwork} from 'state/user/hooks';
import { useProviderOrSigner } from './useProviderOrSigner';

export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible);
  const chainId = useSelectedChainNetwork();
  const canReturnContract = useMemo(() => address && ABI && providerOrSigner, [address, ABI, providerOrSigner]);

  return useMemo(() => {
    if (!canReturnContract) return null;
    try {
      return getContract({
        address,
        abi: ABI,
        signer: providerOrSigner,
        chainId,
      });
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [canReturnContract, address, ABI, providerOrSigner, chainId]) as T;
}

export function useMulticallContract(withSignerIfPossible = false) {
  const chainId = useSelectedChainNetwork();
  return useContract<Multicall>(getMulticall2Address(chainId), MULTICALL_ABI, withSignerIfPossible);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const chainId = useSelectedChainNetwork();
  return useContract<Weth>(
    chainId ? WRAPPED_NATIVE_CURRENCY[chainId]?.address : undefined,
    WETH_ABI,
    withSignerIfPossible,
  );
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract<Erc20Bytes32>(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Pair | null {
  return useContract(pairAddress, PAIR_API, withSignerIfPossible);
}

export function useV2RouterContract(chainId: SupportedChainId): Contract | null {
  return useContract(getRouterV2Address(chainId), ROUTER_V2_02_ABI, true);
}

export function useQuoter(useQuoterV2: boolean) {
  return useContract<Quoter | QuoterV2>(getQuoterAddress(), useQuoterV2 ? QUOTER_V2_ABI : QUOTER_ABI);
}

export function useStakingManagerContract(address: string, withSignerIfPossible = false) {
  return useContract(address, STAKING_MANAFER_ABI, withSignerIfPossible);
}
