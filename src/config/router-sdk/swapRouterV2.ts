import { Interface } from '@ethersproject/abi';
import { Currency, CurrencyAmount, Percent, TradeType } from 'config/sdk-core';
import { Router, Trade as V2Trade } from 'config/v2-sdk';
import { FeeOptions, MethodParameters, PermitOptions } from 'config/v3-sdk';

import { IROUTER_V2_02 } from 'config/abis';

import { Validation } from './multicallExtended';

export interface SwapOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  slippageTolerance: Percent;

  /**
   * The account that should receive the output. If omitted, output is sent to msg.sender.
   */
  recipient?: string;

  /**
   * Either deadline (when the transaction expires, in epoch seconds), or previousBlockhash.
   */
  deadlineOrPreviousBlockhash?: Validation;

  /**
   * The optional permit parameters for spending the input.
   */
  inputTokenPermit?: PermitOptions;

  /**
   * Optional information for taking a fee on output.
   */
  fee?: FeeOptions;
}

export interface SwapAndAddOptions extends SwapOptions {
  /**
   * The optional permit parameters for pulling in remaining output token.
   */
  outputTokenPermit?: PermitOptions;
}

export abstract class SwapRouterV2 {
  public static INTERFACE: Interface = IROUTER_V2_02;

  private constructor() {}

  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(
    trades: V2Trade<Currency, Currency, TradeType>,
    options: SwapOptions,
  ): MethodParameters {
    const { args, methodName, value } = Router.swapCallParameters(trades, {
      allowedSlippage: options.slippageTolerance,
      deadline: Number(options.deadlineOrPreviousBlockhash.toString()),
      recipient: options.recipient,
      feeOnTransfer: false,
    });

    return {
      calldata: SwapRouterV2.INTERFACE.encodeFunctionData(methodName, args),
      value: value,
    };
  }
}
