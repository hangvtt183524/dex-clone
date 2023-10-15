import { Currency, CurrencyAmount, Percent } from 'config/sdk-core';
import useSwapApproval from 'config/swap/useSwapApproval';
import { ApprovalState, useApproval } from 'hooks/useApproval';
import { useCallback, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { TradeType } from 'config/pair';
import { Trade } from 'config/v3-sdk';
import { TransactionInfo, TransactionType } from 'state/transactions/types';
import { findFarmByManagerAddressAndPid } from 'utils/farms';
import { deserializeToken } from 'utils/tokens';

import { useSelectedChainNetwork } from 'state/user/hooks';
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks';
import { useFarms } from '../state/farms/hooks';

enum TypeApproval {
  TOKEN = 'TOKEN',
  FARM = 'FARM',
}

export function useGetAndTrackApproval(
  getApproval: ReturnType<typeof useApproval>[1],
  type: TypeApproval = TypeApproval.TOKEN,
  options?: {
    [key: string]: string;
  },
) {
  const chainId = useSelectedChainNetwork();
  const addTransaction = useTransactionAdder();
  const { data } = useFarms();

  return useCallback(() => {
    return getApproval().then((pending) => {
      if (pending) {
        const { response, tokenAddress, spenderAddress: spender } = pending;

        const isFarm = type === TypeApproval.FARM;
        let dataTransactionInfo = {} as TransactionInfo;

        if (isFarm) {
          const { pid, manager } = options;

          const pool = isFarm ? findFarmByManagerAddressAndPid(data, manager, Number(pid)) : null;
          if (!pool) {
            console.error('this contract is not exist: ', manager, pid);
            return;
          }
          dataTransactionInfo = {
            type: TransactionType.APPROVAL_FARM,
            tokenAddress: pool?.lpAddress,
            spender,
            pid: Number(pid),
            manager,
            chainId,
          };
        } else {
          dataTransactionInfo = {
            type: TransactionType.APPROVAL,
            tokenAddress,
            spender,
          };
        }

        addTransaction(response, dataTransactionInfo);
      }
    });
  }, [addTransaction, chainId, getApproval, options, type]);
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const [approval, getApproval] = useApproval(
    amountToApprove?.currency,
    new BigNumber(amountToApprove?.quotient.toString()),
    spender,
    useHasPendingApproval,
  );
  return [approval, useGetAndTrackApproval(getApproval)];
}

export function useApproveStakeCallback(
  managerAddress: string,
  pid: number,
  amount: string,
): [ApprovalState, () => Promise<void>] {
  const chainId = useSelectedChainNetwork();
  const { data } = useFarms();

  const pool = useMemo(
      () => findFarmByManagerAddressAndPid(data, managerAddress, pid),
      [data, managerAddress, pid]
  );

  const [approval, getApproval] = useApproval(
    deserializeToken({
      address: pool?.tokenStake,
      symbol: pool?.lpSymbol,
      name: pool?.lpSymbol,
      decimals: pool?.lpTokenDecimals,
      chainId,
      wrapped: {
        address: pool?.tokenStake,
        symbol: pool?.lpSymbol,
        name: pool?.lpSymbol,
        decimals: pool?.lpTokenDecimals,
        chainId,
      },
    }),
    amount ? new BigNumber(amount.toString()) : null,
    managerAddress,
    useHasPendingApproval,
  );

  return [
    approval,
    useGetAndTrackApproval(getApproval, TypeApproval.FARM, {
      pid: (pool?.poolId || pid)?.toString(),
      manager: managerAddress,
    }),
  ];
}

export function useApproveCallbackFromTrade(
  trade: Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  options?: { isUniswap: boolean },
): [ApprovalState, () => Promise<void>] {
  const [approval, getApproval] = useSwapApproval(trade as any, allowedSlippage, useHasPendingApproval, {
    isUniswap: options?.isUniswap,
  });

  return [approval, useGetAndTrackApproval(getApproval)];
}
