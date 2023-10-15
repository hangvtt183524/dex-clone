import { AlphaRouter, AlphaRouterConfig } from '@uniswap/smart-order-router';
import { SupportedChainId, CurrencyAmount, Token } from 'config/sdk-core';
import { BigintIsh } from 'config/constants/number';
import { TradeType } from 'config/pair';
import JSBI from 'jsbi';
import { transformSwapRouteToGetQuoteResult } from 'utils/transformSwapRouteToGetQuoteResult';
import { GetQuoteResult } from '../types';

export function toSupportedChainId(chainId: SupportedChainId): SupportedChainId | undefined {
  const numericChainId: number = chainId;
  if (SupportedChainId[numericChainId]) return numericChainId;
  return undefined;
}
export function isSupportedChainId(chainId: SupportedChainId | undefined): boolean {
  return !!toSupportedChainId(chainId);
}

async function getQuote(
  {
    type,
    tokenIn,
    tokenOut,
    amount: amountRaw,
  }: {
    type: 'exactIn' | 'exactOut';
    tokenIn: {
      address: string;
      chainId: number;
      decimals: number;
      symbol?: string;
    };
    tokenOut: {
      address: string;
      chainId: number;
      decimals: number;
      symbol?: string;
    };
    amount: BigintIsh;
  },
  router: AlphaRouter,
  config: Partial<AlphaRouterConfig>,
): Promise<{ data: GetQuoteResult; error?: unknown }> {
  const currencyIn = new Token(tokenIn.chainId, tokenIn.address, tokenIn.decimals, tokenIn.symbol);
  const currencyOut = new Token(tokenOut.chainId, tokenOut.address, tokenOut.decimals, tokenOut.symbol);

  const baseCurrency = type === 'exactIn' ? currencyIn : currencyOut;
  const quoteCurrency = type === 'exactIn' ? currencyOut : currencyIn;

  const amount = CurrencyAmount.fromRawAmount(baseCurrency, JSBI.BigInt(amountRaw));

  const swapRoute = await router.route(
    amount as any,
    quoteCurrency,
    type === 'exactIn' ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    /* swapConfig= */ undefined,
    config,
  );

  if (!swapRoute) throw new Error('Failed to generate client side quote');

  return { data: transformSwapRouteToGetQuoteResult(type, amount, swapRoute) };
}

interface QuoteArguments {
  tokenInAddress: string;
  tokenInChainId: SupportedChainId;
  tokenInDecimals: number;
  tokenInSymbol?: string;
  tokenOutAddress: string;
  tokenOutChainId: SupportedChainId;
  tokenOutDecimals: number;
  tokenOutSymbol?: string;
  amount: string;
  type: 'exactIn' | 'exactOut';
}

export async function getClientSideQuote(
  {
    tokenInAddress,
    tokenInChainId,
    tokenInDecimals,
    tokenInSymbol,
    tokenOutAddress,
    tokenOutChainId,
    tokenOutDecimals,
    tokenOutSymbol,
    amount,
    type,
  }: QuoteArguments,
  router: AlphaRouter,
  config: Partial<AlphaRouterConfig>,
) {
  return getQuote(
    {
      type,
      tokenIn: {
        address: tokenInAddress,
        chainId: tokenInChainId,
        decimals: tokenInDecimals,
        symbol: tokenInSymbol,
      },
      tokenOut: {
        address: tokenOutAddress,
        chainId: tokenOutChainId,
        decimals: tokenOutDecimals,
        symbol: tokenOutSymbol,
      },
      amount,
    },
    router,
    config,
  );
}
