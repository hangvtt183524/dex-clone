import { Trade } from 'config/router-sdk';
import { Currency, Percent, TradeType } from 'config/sdk-core';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { ReactNode, useMemo } from 'react';
import { TransactionType } from 'state/transactions/types';
import { useTransactionDeadline } from 'state/user/hooks';
import { SwapCallbackState, useSwapCallback as useLibSwapCallBack } from 'config/swap/useSwapCallback';

import { useEnsAddress } from 'wagmi';
import { useTransactionAdder } from '../state/transactions/hooks';
import { currencyId } from '../utils/currencyId';

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null,
  // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  // signatureData: SignatureData | undefined | null,
  isUniswap?: boolean,
): {
  state: SwapCallbackState;
  callback: null | (() => Promise<string>);
  error: ReactNode | null;
} {
  const { account } = useActiveWeb3React();

  const deadline = useTransactionDeadline();

  const addTransaction = useTransactionAdder();

  const { data: recipientAddress } = useEnsAddress({
    name: recipientAddressOrName,
  });
  const recipient = recipientAddressOrName === null ? account : recipientAddress;

  const {
    state,
    callback: libCallback,
    error,
  } = useLibSwapCallBack({
    trade,
    allowedSlippage,
    recipientAddressOrName: recipient,
    // signatureData,
    deadline,
    isUniswap,
  });

  const callback = useMemo(() => {
    if (!libCallback || !trade) {
      return null;
    }
    return () =>
      libCallback().then((response) => {
        addTransaction(
          response,
          trade.tradeType === TradeType.EXACT_INPUT
            ? {
                type: TransactionType.SWAP,
                tradeType: TradeType.EXACT_INPUT,
                inputCurrencyId: currencyId(trade.inputAmount.currency),
                inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
                expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                outputCurrencyId: currencyId(trade.outputAmount.currency),
                minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(allowedSlippage).quotient.toString(),
              }
            : {
                type: TransactionType.SWAP,
                tradeType: TradeType.EXACT_OUTPUT,
                inputCurrencyId: currencyId(trade.inputAmount.currency),
                maximumInputCurrencyAmountRaw: trade.maximumAmountIn(allowedSlippage).quotient.toString(),
                outputCurrencyId: currencyId(trade.outputAmount.currency),
                outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
              },
        );
        return response.hash;
      });
  }, [addTransaction, allowedSlippage, libCallback, trade]);

  return {
    state,
    callback,
    error,
  };
}
