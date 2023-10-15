import { CurrencyAmount, Token } from 'config/sdk-core';
import { useTransactionDeadline } from 'state/user/hooks';
import { PermitInfo, PermitType, useERC20Permit } from './swap/useERC20Permit';

const REMOVE_V2_LIQUIDITY_PERMIT_INFO: PermitInfo = {
  version: '1',
  name: 'RoboEx',
  type: PermitType.AMOUNT,
};

export function useV2LiquidityTokenPermit(
  liquidityAmount: CurrencyAmount<Token> | null | undefined,
  spender: string | null | undefined,
) {
  const transactionDeadline = useTransactionDeadline();
  return useERC20Permit(liquidityAmount, spender, transactionDeadline, REMOVE_V2_LIQUIDITY_PERMIT_INFO);
}
