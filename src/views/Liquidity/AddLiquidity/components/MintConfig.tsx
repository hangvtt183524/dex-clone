import { NATIVE_TOKEN } from 'config/tokens';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { configMintState, FieldMint } from 'state/mint/actions';
import { useAppDispatch } from 'state/store';
import { queryParametersToSwapState } from 'state/tokens/hooks';

const MintConfig: React.FC = () => {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!chainId || !NATIVE_TOKEN[chainId] || !router) return;

    const parsed = queryParametersToSwapState(router.query, chainId);
    dispatch(
      configMintState({
        typedValue: '',
        otherTypedValue: '',
        field: parsed.independentField as unknown as FieldMint,
        inputCurrencyId: parsed[FieldMint.INPUT].currencyId,
        outputCurrencyId: parsed[FieldMint.OUTPUT].currencyId,
        recipient: null,
      }),
    );
  }, [router, chainId, dispatch]);

  return null;
};
export default React.memo(MintConfig);
