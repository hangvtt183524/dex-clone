/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import { Currency, Percent, TradeType } from 'config/sdk-core';
import { SwapRouter, UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk';
import { FeeOptions, toHex } from 'config/v3-sdk';
import { prepareSendTransaction, sendTransaction } from '@wagmi/core';
import { NETWORK_SUPPORT_ONLY_V2 } from 'config/constants/chains';
import { Protocol, Trade } from 'config/router-sdk';
import { SwapRouterV2 } from 'config/router-sdk/swapRouterV2';
import { Trade as TradeV2 } from 'config/v2-sdk';
import { useAccount } from 'packages/wagmi/src';
import { useCallback } from 'react';
import { getSwapProtocol } from 'state/routing/utils';
import { getRouterAddress } from 'utils/addressHelpers';
import isZero from 'utils/numbersHelper';
import { swapErrorToUserReadableMessage } from 'utils/swapErrorToUserReadableMessage';
import { PermitSignature } from './usePermitAllowance';
import {useSelectedChainNetwork} from '../state/user/hooks';

class InvalidSwapError extends Error {}

interface SwapOptions {
  slippageTolerance: Percent;
  deadline?: BigNumber;
  permit?: PermitSignature;
  feeOptions?: FeeOptions;
}

export function useUniversalRouterSwapCallback(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  options: SwapOptions,
) {
  const { address } = useAccount();
  const chainId = useSelectedChainNetwork();

  return useCallback(async (): Promise<TransactionResponse> => {
    try {
      if (!address) throw new Error('missing address');
      if (!chainId) throw new Error('missing chainId');
      if (!trade) throw new Error('missing trade');

      const protocol = getSwapProtocol(trade as any);
      const isSwapV2 = protocol === Protocol.V2 && NETWORK_SUPPORT_ONLY_V2.includes(chainId);
      let swapRouterAddress = UNIVERSAL_ROUTER_ADDRESS(chainId);

      let data = '';
      let value = '';

      if (isSwapV2) {
        const params = SwapRouterV2.swapCallParameters(
          new TradeV2(
            trade.routes[0] as any,
            trade.tradeType === TradeType.EXACT_INPUT ? trade.inputAmount : (trade.outputAmount as any),
            trade.tradeType,
          ),
          {
            recipient: address,
            slippageTolerance: options.slippageTolerance as any,
            deadlineOrPreviousBlockhash: options.deadline.toNumber(),
          },
        );
        data = params.calldata;
        value = params.value;
        swapRouterAddress = getRouterAddress(chainId, trade);
      } else {
        const params = SwapRouter.swapERC20CallParameters(trade as any, {
          slippageTolerance: options.slippageTolerance,
          deadlineOrPreviousBlockhash: options.deadline?.toString(),
          inputTokenPermit: options.permit,
          fee: options.feeOptions,
        });
        data = params.calldata;
        value = params.value;
      }

      const tx = {
        from: address,
        to: swapRouterAddress,
        data,
        ...(value && !isZero(value) ? { value: toHex(value) } : {}),
      };

      // let gasEstimate: BigNumber;
      // try {
      //   gasEstimate = await provider.estimateGas(tx);
      // } catch (gasError) {
      //   console.warn(gasError);
      //   throw new Error('Your swap is expected to fail');
      // }
      // const gasLimit = calculateGasMargin(gasEstimate);
      // const response = await provider.sendTransaction({ ...tx }).then((response) => {
      //   if (tx.data !== response.data) {
      //     throw new InvalidSwapError(
      //       t`Your swap was modified through your wallet. If this was a mistake, please cancel immediately or risk losing your funds.`,
      //     );
      //   }
      //   return response;
      // });

      const config = await prepareSendTransaction({
        request: tx,
      });
      const response = await sendTransaction(config);

      return response as TransactionResponse;
    } catch (swapError: unknown) {
      if (swapError instanceof InvalidSwapError) throw swapError;
      throw new Error(swapErrorToUserReadableMessage(swapError) as any);
    }
  }, [address, chainId, options, trade]);
}
