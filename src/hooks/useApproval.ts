import { MaxUint256 } from '@ethersproject/constants';
import type { TransactionResponse } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';
import { Currency, Token } from 'config/sdk-core';
import { useTokenContract } from 'hooks/useContract';
import { useTokenAllowance } from 'hooks/useTokenAllowance';
import { useAccount } from 'packages/wagmi/src';
import { useCallback, useMemo } from 'react';
import { calculateGasMargin } from 'utils/calculateGasMargin';
import { useSelectedChainNetwork } from 'state/user/hooks';

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}
export function useApprovalStateForSpender(
  currency: Currency | undefined,
  amount: BigNumber,
  spender: string | undefined,
  useIsPendingApproval: (token?: Token, spender?: string) => boolean,
): ApprovalState {
  const { address } = useAccount();

  const token = currency ? currency.wrapped : undefined;

  const { tokenAllowance } = useTokenAllowance(token, address ?? undefined, spender);
  const pendingApproval = useIsPendingApproval(token, spender);

  return useMemo(() => {
    if (!currency || !spender || amount.isNaN() || amount.isZero()) return ApprovalState.UNKNOWN;
    if (currency?.isNative) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!tokenAllowance || !tokenAllowance.quotient.toString()) return ApprovalState.UNKNOWN;
    // currency will be defined if tokenAllowance is

    return new BigNumber(tokenAllowance?.quotient.toString()).lt(amount)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amount, currency, tokenAllowance, pendingApproval, spender]);
}

export function useApproval(
  currency: Currency | undefined,
  amount: BigNumber,
  spender: string | undefined,
  useIsPendingApproval: (token?: Token, spender?: string) => boolean,
): [
  ApprovalState,
  () => Promise<
    | {
        response: TransactionResponse;
        tokenAddress: string;
        spenderAddress: string;
      }
    | undefined
  >,
] {
  const chainId = useSelectedChainNetwork();
  // check the current approval status
  const approvalState = useApprovalStateForSpender(currency, amount, spender, useIsPendingApproval);

  const tokenContract = useTokenContract(currency?.wrapped.address);

  const approve = useCallback(async () => {
    function logFailure(error: Error | string): any {
      console.warn(`${currency?.symbol || 'Token'} approval failed:`, error);
    }

    if (!chainId) {
      return logFailure('no chainId');
    }
    if (!currency) {
      return logFailure('no token');
    }
    if (!tokenContract) {
      return logFailure('tokenContract is null');
    }

    if (amount.isNaN() || amount.isZero()) {
      return logFailure('missing amount to approve');
    }
    if (!spender) {
      return logFailure('no spender');
    }

    let useExact = false;
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      useExact = true;
      return tokenContract.estimateGas.approve(spender, amount.toString());
    });

    return tokenContract
      .approve(spender, useExact ? amount.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response) => {
        return {
          response,
          tokenAddress: currency.wrapped.address,
          spenderAddress: spender,
        };
      })
      .catch((error: Error) => {
        logFailure(error);
        throw error;
      });
  }, [chainId, currency, tokenContract, amount, spender]);

  return [approvalState, approve];
}
