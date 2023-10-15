import { BigNumber } from '@ethersproject/bignumber';
import type { TransactionResponse } from '@ethersproject/providers';
import { prepareSendTransaction, sendTransaction } from '@wagmi/core';
import { Trade } from 'config/router-sdk';
import { Currency, TradeType } from 'config/sdk-core';
import { useProviderOrSigner } from 'hooks/useProviderOrSigner';
import { Trans, useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import { calculateGasMargin } from 'utils/calculateGasMargin';
import isZero from 'utils/numbersHelper';
import { swapErrorToUserReadableMessage } from 'utils/swapErrorToUserReadableMessage';

interface SwapCall {
  address: string;
  calldata: string;
  value: string;
}

interface SwapCallEstimate {
  call: SwapCall;
}

interface SuccessfulCall extends SwapCallEstimate {
  call: SwapCall;
  gasEstimate: BigNumber;
}

// returns a function that will execute a swap, if the parameters are all valid
export default function useSendSwapTransaction(
  account: string | null | undefined,
  chainId: number | undefined,
  trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  swapCalls: SwapCall[],
): { callback: null | (() => Promise<TransactionResponse>) } {
  const { t } = useTranslation();
  const provider = useProviderOrSigner();

  return useMemo(() => {
    if (!trade || !account || !chainId) {
      return { callback: null };
    }

    return {
      callback: async function onSwap(): Promise<TransactionResponse> {
        const estimatedCalls = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call;
            const tx =
              !value || isZero(value)
                ? { from: account, to: address, data: calldata }
                : {
                    from: account,
                    to: address,
                    data: calldata,
                    value,
                  };

            return provider
              .estimateGas(tx)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                };
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call);
                return provider
                  .call(tx)
                  .then((result) => {
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result);
                    return {
                      call,
                      error: (
                        <Trans>Unexpected issue with estimating the gas or increase Slippage. Please try again.</Trans>
                      ),
                    };
                  })
                  .catch((callError) => {
                    console.debug('Call threw error', call, callError);
                    return {
                      call,
                      error: swapErrorToUserReadableMessage(callError),
                    };
                  });
              });
          }),
        );
        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        );

        // check if any calls errored with a recognizable error
        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is any => 'error' in call);
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error;
          const firstNoErrorCall = estimatedCalls.find<any>((call): call is any => !('error' in call));
          if (!firstNoErrorCall) throw new Error(t`Unexpected error. Could not estimate gas for the swap.`);
          bestCallOption = firstNoErrorCall;
        }

        const {
          call: { address, calldata, value },
        } = bestCallOption;

        const config = await prepareSendTransaction({
          request: {
            from: account,
            to: address,
            data: calldata,
            // let the wallet try if we can't estimate the gas
            ...('gasEstimate' in bestCallOption
              ? {
                  gasLimit: calculateGasMargin(bestCallOption.gasEstimate.mul(2)),
                }
              : {}),
            ...(value && !isZero(value) ? { value } : {}),
          },
        });
        return sendTransaction(config)
          .then((response) => {
            return response as TransactionResponse;
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001 || error.code === 'ACTION_REJECTED') {
              throw new Error(t`Transaction rejected`);
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error('Swap failed', error, address, calldata, value);
              console.debug(swapErrorToUserReadableMessage(error));
              return t`Swap failed: ${swapErrorToUserReadableMessage(error) as any}`;
            }
          });
      },
    };
  }, [account, chainId, provider, swapCalls, t, trade]);
}
