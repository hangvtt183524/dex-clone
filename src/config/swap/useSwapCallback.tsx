import { BigNumber } from '@ethersproject/bignumber';
import type { TransactionResponse } from '@ethersproject/providers';
import { Trade } from 'config/router-sdk';
import { Currency, Percent, TradeType } from 'config/sdk-core';
import { Trans } from 'react-i18next';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import React, { ReactNode, useMemo } from 'react';
import { useEnsAddress } from 'wagmi';
import { useSwapCallArguments } from './useSwapCallArguments';
import useSendSwapTransaction from './useSendSwapTransaction';

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface UseSwapCallbackReturns {
  state: SwapCallbackState;
  callback?: () => Promise<TransactionResponse>;
  error?: ReactNode;
}
interface UseSwapCallbackArgs {
  trade: Trade<Currency, Currency, TradeType> | undefined; // trade to execute, required
  allowedSlippage: Percent; // in bips
  recipientAddressOrName: string | null | undefined;
  // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  // signatureData: SignatureData | null | undefined;
  deadline: BigNumber | undefined;
  // feeOptions?: FeeOptions;
  isUniswap?: boolean;
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback({
  trade,
  allowedSlippage,
  recipientAddressOrName,
  // signatureData,
  deadline,
  isUniswap,
}: // feeOptions,
UseSwapCallbackArgs): UseSwapCallbackReturns {
  const { account, chainId } = useActiveWeb3React();
  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    recipientAddressOrName,
    // signatureData,
    deadline,
    // feeOptions,
    {
      isUniswap,
    },
  );

  const { callback } = useSendSwapTransaction(account, chainId, trade, swapCalls);

  const { data: recipientAddress } = useEnsAddress({
    name: recipientAddressOrName,
  });
  const recipient = recipientAddressOrName === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !account || !chainId || !callback) {
      return {
        state: SwapCallbackState.INVALID,
        error: <Trans>Missing dependencies</Trans>,
      };
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return {
          state: SwapCallbackState.INVALID,
          error: <Trans>Invalid recipient</Trans>,
        };
      }
      return { state: SwapCallbackState.LOADING };
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async () => callback(),
    };
  }, [trade, account, chainId, callback, recipient, recipientAddressOrName]);
}
