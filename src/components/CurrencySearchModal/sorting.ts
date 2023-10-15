import { CurrencyAmount, Currency, Token } from 'config/sdk-core';
import { useAllTokenBalances } from 'hooks/useBalances';
import { useMemo } from 'react';
import { usePinTokens } from 'state/tokens/hooks';

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: CurrencyAmount<Currency>, balanceB?: CurrencyAmount<Currency>) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB.numerator) ? -1 : balanceA.equalTo(balanceB.numerator) ? 0 : 1;
  }
  if (balanceA && balanceA.greaterThan('0')) {
    return -1;
  }
  if (balanceB && balanceB.greaterThan('0')) {
    return 1;
  }
  return 0;
}

// compare two token favor
function pinComparator(isPinA: boolean, isPinB: boolean) {
    if (isPinA) {
        return -1;
    }

    if (isPinB) {
        return 1;
    }

    return 0;
}

function getTokenComparator(chainId: number, balances: {
  [tokenAddress: string]: CurrencyAmount<Currency> | undefined;
}, pins: any): (tokenA: Token, tokenB: Token) => number {
  return function sortTokens(tokenA: Token, tokenB: Token): number {
    // -1 = a is first
    // 1 = b is first

    // sort by pin
    const isPinA = pins?.[chainId]?.[tokenA.address] || false;
    const isPinB = pins?.[chainId]?.[tokenB.address] || false;

    const pinComp = pinComparator(isPinA, isPinB);
    if (pinComp !== 0) return pinComp;

    // sort by balances
    const balanceA = balances[tokenA.address];
    const balanceB = balances[tokenB.address];

    const balanceComp = balanceComparator(balanceA, balanceB);
    if (balanceComp !== 0) return balanceComp;

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
    }
    return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0;
  };
}

function useTokenComparator(chainId: number, inverted = false): (tokenA: Token, tokenB: Token) => number {
  const balances = useAllTokenBalances();
  const pinTokens = usePinTokens();
  const comparator = useMemo(() => getTokenComparator(chainId, balances ?? {}, pinTokens ?? {}), [balances, pinTokens]);
  return useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1;
    }
    return comparator;
  }, [inverted, comparator]);
}

export default useTokenComparator;
