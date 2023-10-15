import { useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';

import { deserializeToken } from 'utils/tokens';
import { SerializedToken } from 'config/types/token';
import { useSelector } from 'react-redux';
import { Token } from 'config/sdk-core';
import { useSelectedChainNetwork } from './hooks';

const selectUserTokens = ({ user: { tokens } }) => tokens;

export const userAddedTokenSelector = (chainId: number) =>
  createSelector(selectUserTokens, (serializedTokensMap) =>
    Object.values<SerializedToken>(serializedTokensMap?.[chainId] ?? {})
      .filter((serializedTokensMap) => serializedTokensMap)
      .map(deserializeToken),
  );
export default function useUserAddedTokens(): Token[] {
  const chainId = useSelectedChainNetwork();
  return useSelector(useMemo(() => userAddedTokenSelector(chainId), [chainId]));
}
