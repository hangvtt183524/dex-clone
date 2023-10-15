import { AllowanceTransfer, MaxAllowanceTransferAmount, PERMIT2_ADDRESS, PermitSingle } from '@uniswap/permit2-sdk';
import { signTypedData } from '@wagmi/core';
import { PERMIT2_ABI } from 'config/abis';
import { PERMIT2 } from 'config/abis/types';
import { CurrencyAmount, Token } from 'config/sdk-core';

import { useContract } from 'hooks/useContract';
import ms from 'ms.macro';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSingleCallResult } from 'state/multicall/hooks';
import useActiveWeb3React from './web3React/useActiveWeb3React';

const PERMIT_EXPIRATION = ms`30d`;
const PERMIT_SIG_EXPIRATION = ms`30m`;

function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000);
}

export function usePermitAllowance(token?: Token, owner?: string, spender?: string) {
  const contract = useContract<PERMIT2>(PERMIT2_ADDRESS, PERMIT2_ABI);
  const inputs = useMemo(() => [owner, token?.address, spender], [owner, spender, token?.address]);

  // If there is no allowance yet, re-check next observed block.
  // This guarantees that the permitAllowance is synced upon submission and updated upon being synced.
  const [blocksPerFetch, setBlocksPerFetch] = useState<1>();
  const result = useSingleCallResult(contract, 'allowance', inputs, {
    blocksPerFetch,
  }).result as Awaited<ReturnType<PERMIT2['allowance']>> | undefined;

  const rawAmount = result?.amount.toString();
  const allowance = useMemo(
    () => (token && rawAmount ? CurrencyAmount.fromRawAmount(token, rawAmount) : undefined),
    [token, rawAmount],
  );
  useEffect(() => setBlocksPerFetch(allowance?.equalTo(0) ? 1 : undefined), [allowance]);

  return useMemo(
    () => ({ permitAllowance: allowance, expiration: result?.expiration, nonce: result?.nonce }),
    [allowance, result?.expiration, result?.nonce],
  );
}

interface Permit extends PermitSingle {
  sigDeadline: number;
}

export interface PermitSignature extends Permit {
  signature: string;
}

export function useUpdatePermitAllowance(
  token: Token | undefined,
  spender: string | undefined,
  nonce: number | undefined,
  onPermitSignature: (signature: PermitSignature) => void,
) {
  const { provider, chainId } = useActiveWeb3React();

  return useCallback(async () => {
    try {
      if (!chainId) throw new Error('missing chainId');
      if (!provider) throw new Error('missing provider');
      if (!token) throw new Error('missing token');
      if (!spender) throw new Error('missing spender');
      if (nonce === undefined) throw new Error('missing nonce');

      const permit: Permit = {
        details: {
          token: token.address,
          amount: MaxAllowanceTransferAmount,
          expiration: toDeadline(PERMIT_EXPIRATION),
          nonce,
        },
        spender,
        sigDeadline: toDeadline(PERMIT_SIG_EXPIRATION),
      };

      const { domain, types, values } = AllowanceTransfer.getPermitData(permit, PERMIT2_ADDRESS, chainId);

      const signature = await signTypedData({
        domain: domain as any,
        types: types as any,
        value: values as any,
      });
      onPermitSignature?.({ ...permit, signature });
    } catch (e: unknown) {
      const symbol = token?.symbol ?? 'Token';
      throw new Error(`${symbol} permit allowance failed: ${e instanceof Error ? e.message : e}`);
    }
  }, [chainId, nonce, onPermitSignature, provider, spender, token]);
}
