import { BigNumber } from '@ethersproject/bignumber';
import { Protocol, Trade } from 'config/router-sdk';
import { SwapRouterV2 } from 'config/router-sdk/swapRouterV2';

import { Trade as TradeV2 } from 'config/v2-sdk';

import { Currency, Percent, TradeType } from 'config/sdk-core';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { useMemo } from 'react';
import { getSwapProtocol } from 'state/routing/utils';
import { getRouterAddress } from 'utils/addressHelpers';
import { useEnsAddress } from 'wagmi';

interface SwapCall {
  address: string;
  calldata: string;
  value: string;
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 */
export const useSwapCallArguments = (
  trade: Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  recipientAddressOrName: string | null | undefined,
  // signatureData: SignatureData | null | undefined,
  deadline: BigNumber | undefined,
  // feeOptions: FeeOptions | undefined,
  options?: {
    isUniswap?: boolean;
  },
): SwapCall[] => {
  const { account, chainId, provider } = useActiveWeb3React();

  const { data: recipientAddress } = useEnsAddress({
    name: recipientAddressOrName,
  });
  const recipient = recipientAddressOrName === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !recipient || !provider || !account || !chainId || !deadline) return [];

    const protocol = getSwapProtocol(trade);
    const isSwapV2 = protocol === Protocol.V2;
    // TODO, PREVENT SWAP IF THAT'S NOT ROUTE V2

    const swapRouterAddress = getRouterAddress(chainId, trade, options?.isUniswap);

    if (!swapRouterAddress || !isSwapV2) return [];

    if (isSwapV2) {
      return trade?.routes.map((route) => {
        const { calldata, value } = SwapRouterV2.swapCallParameters(
          new TradeV2(
            route as any,
            trade.tradeType === TradeType.EXACT_INPUT ? trade.inputAmount : trade.outputAmount,
            trade.tradeType,
          ),
          {
            slippageTolerance: allowedSlippage,
            recipient,
            deadlineOrPreviousBlockhash: deadline.toNumber(),
          },
        );
        return {
          address: swapRouterAddress,
          calldata,
          value,
        };
      });
    }

    console.error('Route v3');

    return [
      {
        address: swapRouterAddress,
        calldata: '0x0',
        value: '0x0',
      },
    ];
    // return [
    //   {
    //     address: swapRouterAddress,
    //     calldata,
    //     value,
    //   },
    // ];
    // }

    // const { value, calldata } = SwapRouter.swapCallParameters(trade, {
    //   recipient,
    //   slippageTolerance: allowedSlippage,

    //   deadlineOrPreviousBlockhash: deadline.toString(),
    // });
    // console.log(trade, value, calldata);

    // return [
    //   {
    //     address: swapRouterAddress,
    //     calldata,
    //     value,
    //   },
    // ];
  }, [account, allowedSlippage, chainId, deadline, options, provider, recipient, trade]);
};
