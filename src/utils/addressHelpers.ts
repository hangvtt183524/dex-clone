import { getAddress } from '@ethersproject/address';
import { NATIVE_CHAIN_ID } from 'config/constants';
import addresses from 'config/constants/contracts';
import { ZERO_ADDRESS } from 'config/constants/misc';
import { CHAIN_ID } from 'config/env';
import { Trade } from 'config/router-sdk';
import { Currency, SupportedChainId, TradeType } from 'config/sdk-core';
import { Address } from 'config/types';

export const getAddressChainId = (address: Address, chainId: number = CHAIN_ID): string =>
  address[chainId] ? address[chainId] : address[SupportedChainId.MAINNET];

export const truncateHash = (account: string, startLength = 6, endLength = 4) =>
  `${account.substring(0, startLength)}...${account.substring(account.length - endLength)}`;

export function isAddress(value: any): string | false {
  try {
    return value.toLowerCase() === ZERO_ADDRESS ? false : getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

export const compareAddress = (addressA, addressB) => addressA?.toLowerCase() === addressB?.toLowerCase();

export const getAddressCurrency = (currency: Currency) =>
  currency.isNative ? currency.symbol : currency.wrapped.address;

export const getTokenAddress = (currency: Currency) => (currency.isNative ? NATIVE_CHAIN_ID : currency.wrapped.address);

export const getMulticall2Address = (chainId?: number) => {
  return getAddressChainId(addresses.multicall2, chainId);
};

export const getFactoryV2Address = (chainId: SupportedChainId) => {
  return getAddressChainId(addresses.factoryV2, chainId);
};

export const getFactoryV2AddressUniswap = (chainId: SupportedChainId) => {
  return getAddressChainId(addresses.factoryV2Uniswap, chainId);
};

export const getFactoryV3Address = (chainId: number = CHAIN_ID) => {
  return getAddressChainId(addresses.factoryV3, chainId);
};

export const getRouterV3Address = (chainId: number = CHAIN_ID) => {
  return getAddressChainId(addresses.routerV3, chainId);
};

export const getRouterV2Address = (chainId: SupportedChainId) => {
  return getAddressChainId(addresses.routerV2, chainId);
};

export const getRouterV2UniswapAddress = (chainId: SupportedChainId) => {
  return getAddressChainId(addresses.routerV2Uniswap, chainId);
};
export const getRouterAddress = (chainId: number, trade: Trade<Currency, Currency, TradeType>, isUniswap?: boolean) => {
  // const protocol = getSwapProtocol(trade);
  // const isSwapOnlyVer2 = NETWORK_SUPPORT_ONLY_V2.includes(chainId);

  // const swapRouterAddress = chainId
  //   ? isSwapOnlyVer2 && protocol === Protocol.V2
  //     ? getRouterV2Address(chainId)
  //     : getRouterV3Address(chainId)
  //   : undefined;

  return isUniswap ? getRouterV2UniswapAddress(chainId) : getRouterV2Address(chainId);
};

export const getQuoterAddress = (chainId: number = CHAIN_ID) => {
  return getAddressChainId(addresses.quoter, chainId);
};
