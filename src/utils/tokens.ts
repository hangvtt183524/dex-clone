import axios from 'axios';
import { SerializedToken } from 'config/types/token';
import { TokenAddressMap } from 'config/types/lists';
import { Token } from 'config/sdk-core';
import { getCookie } from './cookies';

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Token): boolean {
  if (currency?.isNative) return true;
  return Boolean(defaultTokens[currency.chainId]?.[currency.address]);
}

export const deserializeToken = (serializedToken: SerializedToken) => {
  if (!serializedToken?.chainId || !serializedToken?.decimals) return null;

  return new Token(
    serializedToken?.chainId,
    serializedToken?.address,
    serializedToken?.decimals,
    serializedToken?.symbol,
    serializedToken?.name,
  );
};
export function serializedToken(unserializedTokens) {
  if (!unserializedTokens) return null;
  const wrapped = unserializedTokens?.wrapped || unserializedTokens;
  return {
    chainId: unserializedTokens.chainId,
    address: unserializedTokens.address,
    decimals: unserializedTokens.decimals,
    symbol: unserializedTokens.symbol,
    name: unserializedTokens.name,
    wrapped: {
      chainId: wrapped.chainId,
      address: wrapped.address,
      decimals: wrapped.decimals,
      symbol: wrapped.symbol,
      name: wrapped.name,
    },
  };
}

export function serializedTokens(unserializedTokens) {
  if (!unserializedTokens) return null;

  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return {
      ...accum,
      [key]: serializedToken(unserializedTokens[key]),
    };
  }, {} as any);

  return serializedTokens;
}

export async function getFarmPoolsInfo(network = 'ethereum') {
    const BASE_URL =  process.env.NEXT_PUBLIC_BASE_URL
    const bearerToken = getCookie('idToken');

    const res = await axios.get(`${BASE_URL}/farm/pools?network=${network}`,
        {
            timeout: 5000,
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });

    if (res?.data) {
        return res.data;
    }

    return null;
}