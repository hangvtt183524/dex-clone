import { CurrencyAmount, MaxUint256, Token } from 'config/sdk-core';
import { ContractTransaction, BigNumberish } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useSingleCallResult } from 'state/multicall/hooks';
import { ApproveTransactionInfo, TransactionType } from 'state/transactions/types';

import { useTokenContract } from './useContract';

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): {
  tokenAllowance: CurrencyAmount<Token> | undefined;
  isSyncing: boolean;
} {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner, spender], [owner, spender]);

  const { result, syncing: isSyncing } = useSingleCallResult(contract, 'allowance', inputs, { blocksPerFetch: 1 });

  const rawAmount = result?.toString(); // convert to a string before using in a hook, to avoid spurious rerenders
  const allowance = useMemo(
    () => (token && rawAmount ? CurrencyAmount.fromRawAmount(token, rawAmount) : undefined),
    [token, rawAmount],
  );

  return useMemo(() => ({ tokenAllowance: allowance, isSyncing }), [allowance, isSyncing]);
}

export function useUpdateTokenAllowance(
  amount: CurrencyAmount<Token> | undefined,
  spender: string,
): () => Promise<{ response: ContractTransaction; info: ApproveTransactionInfo }> {
  const contract = useTokenContract(amount?.currency.address);

  return useCallback(async () => {
    try {
      if (!amount) throw new Error('missing amount');
      if (!contract) throw new Error('missing contract');
      if (!spender) throw new Error('missing spender');

      const allowance: BigNumberish = MaxUint256.toString();
      const response = await contract.approve(spender, allowance);
      return {
        response,
        info: {
          type: TransactionType.APPROVAL,
          tokenAddress: contract.address,
          spender,
        },
      };
    } catch (e: unknown) {
      const symbol = amount?.currency.symbol ?? 'Token';
      throw new Error(`${symbol} token allowance failed: ${e instanceof Error ? e.message : e}`);
    }
  }, [amount, contract, spender]);
}
