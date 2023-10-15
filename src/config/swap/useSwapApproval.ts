import { Currency, Token, Percent } from 'config/sdk-core';
import { useMemo } from 'react';
import { getRouterAddress } from 'utils/addressHelpers';
import { Trade } from 'config/router-sdk';
import { TradeType } from 'config/pair';
import BigNumber from 'bignumber.js';
import { useApproval } from 'hooks/useApproval';
import { useSelectedChainNetwork } from 'state/user/hooks';

export default function useSwapApproval(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  useIsPendingApproval: (token?: Token, spender?: string) => boolean,
  options?: { isUniswap?: boolean },
) {
  const chainId = useSelectedChainNetwork();

  const amountToApprove = useMemo(
    () => (trade && !trade.inputAmount.currency.isNative ? trade.maximumAmountIn(allowedSlippage) : undefined),
    [trade, allowedSlippage],
  );

  const spender = chainId ? getRouterAddress(chainId, trade, options?.isUniswap) : undefined;

  return useApproval(
    amountToApprove?.currency,
    new BigNumber(amountToApprove?.quotient?.toString()),
    spender,
    useIsPendingApproval,
  );
}
