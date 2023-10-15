import { Pair } from 'config/v2-sdk';
import { isAddress } from 'utils/addressHelpers';

export function createFilterPair(search: string): (pair: Pair) => boolean {
  const searchingAddress = isAddress(search) ? search : '';

  if (searchingAddress) {
    const address = searchingAddress.toLowerCase();
    return (t: Pair) =>
      address === t.liquidityToken.address.toString().toLowerCase() ||
      address === t.token0.address.toString().toLowerCase() ||
      address === t.token1.address.toString().toLowerCase();
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  if (lowerSearchParts.length === 0) {
    return () => true;
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0);

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)));
  };
  return (pair) => {
    const { liquidityToken, token0, token1 } = pair;

    const validateSymbolLp = liquidityToken.symbol && matchesSearch(liquidityToken.symbol);
    const validateSymbolToken0 = token0.symbol && matchesSearch(token0.symbol);
    const validateSymbolToken1 = token1.symbol && matchesSearch(token1.symbol);

    return validateSymbolLp || validateSymbolToken0 || validateSymbolToken1;
  };
}
