import { Percent, CurrencyAmount, Currency, Token } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { FieldBurn } from 'state/burn/actions';
import { Contract } from 'ethers';
import {useSelectedChainNetwork, useTransactionDeadline} from 'state/user/hooks';
import { useCallback, useMemo } from 'react';
import { ApprovalState } from 'hooks/useApproval';

import { usePairContract, useV2RouterContract } from './useContract';
import { useApproveCallback } from './useApproveCallback';

export const useBurnApproveCallback = ({
  parsedAmounts,
  // gatherPermitSignature,
  pair,
}: {
  pair: Pair;
  parsedAmounts: {
    [FieldBurn.LIQUIDITY_PERCENT]: Percent;
    [FieldBurn.LIQUIDITY]?: CurrencyAmount<Token>;
    [FieldBurn.CURRENCY_A]?: CurrencyAmount<Currency>;
    [FieldBurn.CURRENCY_B]?: CurrencyAmount<Currency>;
  };
  gatherPermitSignature: () => Promise<void>;
}): [ApprovalState, () => Promise<void>] => {
  const chainId = useSelectedChainNetwork();

  const routerContract = useV2RouterContract(chainId);

  const deadline = useTransactionDeadline();

  const [approval, approveCallback] = useApproveCallback(parsedAmounts[FieldBurn.LIQUIDITY], routerContract?.address);
  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address);

  const handleApprove = useCallback(async () => {
    if (!pairContract || !pair || !deadline) throw new Error('missing dependencies');
    const liquidityAmount = parsedAmounts[FieldBurn.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    return approveCallback();
  }, [approveCallback, deadline, pair, pairContract, parsedAmounts]);

  return useMemo(() => [approval, handleApprove], [approval, handleApprove]);
};
