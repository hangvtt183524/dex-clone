import { Currency, Price, Token } from 'config/sdk-core';
import { useMemo } from 'react';
import { BASE_USD_TOKEN, WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import JSBI from 'jsbi';

import {useSelectedChainNetwork} from 'state/user/hooks';
import { PairState, useV2Pairs } from '../pool/useV2Pairs';

export default function useUSDPrice(token?: Currency): Price<Currency, Currency> | undefined {
  const chainId = useSelectedChainNetwork();

  const wrapped: Token = token?.wrapped || (token as Token);

  const wrapNative: Token = useMemo(() => WRAPPED_NATIVE_CURRENCY[chainId], [chainId]);
  const usdToken: Currency = useMemo(() => BASE_USD_TOKEN[chainId], [chainId]);
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wrapNative.equals(wrapped) ? undefined : token, chainId ? wrapNative : undefined],
      [wrapped?.equals(usdToken) ? undefined : wrapped, chainId ? usdToken : undefined],
      [chainId ? wrapNative : undefined, chainId ? usdToken : undefined],
    ],
    [chainId, token, usdToken, wrapNative, wrapped],
  );
  const [[nativePairState, nativePair], [usdPairState, usdPair], [usdNativePairState, usdNativePair]] = useV2Pairs(
    tokenPairs,
    {
      isUniswap: true,
    },
  );

  return useMemo(() => {
    if (!token || !wrapped || !chainId) {
      return undefined;
    }

    // handle weth/eth
    if (wrapped.equals(wrapNative)) {
      if (usdPair) {
        const price = usdPair.priceOf(wrapNative);
        return new Price(token, usdToken, price.denominator, price.numerator);
      }
      return undefined;
    }
    // handle usd
    if (wrapped.equals(usdToken)) {
      return new Price(usdToken, usdToken, '1', '1');
    }
    const nativePairETHAmount = nativePair?.reserveOf(wrapNative);
    const nativePairETHUSDValue: JSBI =
      nativePairETHAmount && usdNativePair
        ? usdNativePair.priceOf(wrapNative).quote(nativePairETHAmount).quotient
        : JSBI.BigInt(0);

    // all other tokens
    // first try the busd pair
    if (
      usdPairState === PairState.EXISTS &&
      usdPair &&
      usdPair.reserveOf(usdToken).greaterThan(nativePairETHUSDValue)
    ) {
      const price = usdPair.priceOf(wrapped);
      return new Price(token, usdToken, price.denominator, price.numerator);
    }
    if (
      nativePairState === PairState.EXISTS &&
      nativePair &&
      usdNativePairState === PairState.EXISTS &&
      usdNativePair
    ) {
      if (usdNativePair.reserveOf(usdToken).greaterThan('0') && nativePair.reserveOf(wrapNative).greaterThan('0')) {
        const ethBusdPrice = usdNativePair.priceOf(usdToken);
        const currencyEthPrice = nativePair.priceOf(wrapNative);
        const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert();
        return new Price(token, usdToken, busdPrice.denominator, busdPrice.numerator);
      }
    }

    return undefined;
  }, [
    token,
    wrapped,
    chainId,
    wrapNative,
    usdToken,
    nativePair,
    usdNativePair,
    usdPairState,
    usdPair,
    nativePairState,
    usdNativePairState,
  ]);
}

// export const useUSDCurrencyAmount = (token: Token, amount: number): number | undefined => {
//   const { chainId } = useActiveWeb3React();
//   const usdPrice = useUSDPrice(token);
//   if (usdPrice) {
//     return multiplyPriceByAmount(usdPrice, amount, token.wrapped.decimals);
//   }
//   return undefined;
// };

export const useNativeUsdPrice = (): Price<Currency, Currency> | undefined => {
  const chainId = useSelectedChainNetwork();
  const wrapNative: Token = useMemo(() => WRAPPED_NATIVE_CURRENCY[chainId], [chainId]);

  const nativeUsdPrice = useUSDPrice(wrapNative);
  return nativeUsdPrice;
};
