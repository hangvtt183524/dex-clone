import { BigNumber } from '@ethersproject/bignumber';
import { L2_CHAIN_IDS } from 'config/constants/chains';
import { L2_DEADLINE_FROM_NOW } from 'config/constants/misc';
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants/pair';

import { SupportedChainId, Token } from 'config/sdk-core';
import { computePairAddress, Pair } from 'config/v2-sdk';
import { useAllTokens } from 'hooks/Tokens';
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp';
import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'state/store';
import { getFactoryV2Address } from 'utils/addressHelpers';
import { deserializeToken, serializedToken } from 'utils/tokens';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import {
    addSerializedPair,
    addSerializedToken,
    FarmStakedOnly, removeSerializedToken,
    SerializedPair,
    updateTokensImport,
    updateUserClientSideRouter,
    updateUserDeadline,
    updateUserExpertMode,
    updateUserExpertModeAcknowledgementShow,
    updateUserFarmStakedOnly,
    updateUserSingleHopOnly,
    updateUserSlippageTolerance,
} from './actions';

export const useIsExpertMode = (): boolean => useAppSelector((state) => state.user.userExpertMode);

export const useExpertModeManager = (): [boolean, () => void] => {
  const dispatch = useAppDispatch();
  const expertMode = useIsExpertMode();

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }));
  }, [expertMode, dispatch]);

  return [expertMode, toggleSetExpertMode];
};

export const useUserExpertModeAcknowledgementShow = (): [boolean, (showAcknowledgement: boolean) => void] => {
  const dispatch = useAppDispatch();
  const userExpertModeAcknowledgementShow = useAppSelector((state) => state.user.userExpertModeAcknowledgementShow);

  const setUserExpertModeAcknowledgementShow = useCallback(
    (showAcknowledgement: boolean) => {
      dispatch(
        updateUserExpertModeAcknowledgementShow({
          userExpertModeAcknowledgementShow: showAcknowledgement,
        }),
      );
    },
    [dispatch],
  );

  return [userExpertModeAcknowledgementShow, setUserExpertModeAcknowledgementShow];
};

export const useUserSingleHopOnly = (): [boolean, (newSingleHopOnly: boolean) => void] => {
  const dispatch = useAppDispatch();

  const singleHopOnly = useAppSelector((state) => state.user.userSingleHopOnly);

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }));
    },
    [dispatch],
  );

  return [singleHopOnly, setSingleHopOnly];
};

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch();
  const userSlippageTolerance = useAppSelector((state) => {
    return state.user.userSlippageTolerance;
  });

  const setUserSlippageTolerance = useCallback(
    (slippage: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance: slippage }));
    },
    [dispatch],
  );

  return [userSlippageTolerance, setUserSlippageTolerance];
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch();
  const userDeadline = useAppSelector((state) => {
    return state.user.userDeadline;
  });

  const setUserDeadline = useCallback(
    (deadline: number) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }));
    },
    [dispatch],
  );

  return [userDeadline, setUserDeadline];
}

export function useUserFarmStakedOnly(isActive: boolean): [boolean, (stakedOnly: boolean) => void] {
  const dispatch = useAppDispatch();
  const userFarmStakedOnly = useAppSelector((state) => {
    return state.user.userFarmStakedOnly;
  });

  const setUserFarmStakedOnly = useCallback(
    (stakedOnly: boolean) => {
      const farmStakedOnly = stakedOnly ? FarmStakedOnly.TRUE : FarmStakedOnly.FALSE;
      dispatch(updateUserFarmStakedOnly({ userFarmStakedOnly: farmStakedOnly }));
    },
    [dispatch],
  );
  return [
    userFarmStakedOnly === FarmStakedOnly.ON_FINISHED ? !isActive : userFarmStakedOnly === FarmStakedOnly.TRUE,
    setUserFarmStakedOnly,
  ];
}

export function useTransactionDeadline(): BigNumber | undefined {
  const chainId = useSelectedChainNetwork();
  const ttl = useAppSelector((state) => state.user.userDeadline);
  const blockTimestamp = useCurrentBlockTimestamp();

  return useMemo(() => {
    if (blockTimestamp && chainId && L2_CHAIN_IDS.includes(chainId)) return blockTimestamp.add(L2_DEADLINE_FROM_NOW);
    if (blockTimestamp && ttl) return blockTimestamp.add(ttl);
    return undefined;
  }, [blockTimestamp, chainId, ttl]);
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializedToken(token) }));
    },
    [dispatch],
  );
}

export function useImportToken(): [
  {
    [chainId: number]: {
      [account: string]: {
        [tokenAddress: string]: true;
      };
    };
  },
  (tokenAddress: string, account: string, chainId: SupportedChainId) => void,
] {
  const dispatch = useAppDispatch();
  const tokensImported = useAppSelector((state) => state.user.tokensImported);

  const handleImportToken = useCallback(
    (tokenAddress: string, account: string, chainId: SupportedChainId) => {
      dispatch(updateTokensImport({ account, chainId, tokenAddress }));
    },
    [dispatch],
  );

  return [tokensImported, handleImportToken];
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React();
  const tokens = useAllTokens();
  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId]);

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? Object.keys(tokens).flatMap((tokenAddress) => {
            const token = tokens[tokenAddress];
            // for each token on the current chain,
            if (!token) return null;

            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base?.address === token.address) {
                    return null;
                  }
                  return [base, token];
                })
                .filter((p): p is [Token, Token] => p !== null)
            );
          })
        : [],
    [tokens, chainId],
  );

  // pairs saved by users
  const savedSerializedPairs = useAppSelector(({ user: { pairs } }) => pairs);

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return [];
    const forChain = savedSerializedPairs[chainId];
    if (!forChain) return [];
    return Object.keys(forChain).map((pairId) => {
      if (!forChain?.[pairId]?.token0 || !forChain?.[pairId]?.token1) return [null, null];

      return [deserializeToken(forChain[pairId]?.token0), deserializeToken(forChain[pairId]?.token1)];
    });
  }, [savedSerializedPairs, chainId]);

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs],
  );

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      if (!tokenA || !tokenB) return memo;

      const sorted = tokenA?.sortsBefore(tokenB);

      const key = sorted ? `${tokenA?.address}:${tokenB.address}` : `${tokenB?.address}:${tokenA?.address}`;
      if (memo[key]) return memo;
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
      return memo;
    }, {});

    return Object.keys(keyed).map((key) => keyed[key]);
  }, [combinedList]);
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  const factoryV2Address = getFactoryV2Address(tokenA.chainId);

  if (tokenA.chainId !== tokenB.chainId) throw new Error('Not matching chain IDs');
  if (tokenA.equals(tokenB)) throw new Error('Tokens cannot be equal');
  if (!factoryV2Address) throw new Error('No V2 factory address on this chain');

  return new Token(
    tokenA.chainId,
    computePairAddress({ factoryAddress: factoryV2Address, tokenA, tokenB }),
    18,
    'ROBO',
    'RoboEx',
  );
}

export function useClientSideRouter(): [boolean, (userClientSideRouter: boolean) => void] {
  const dispatch = useAppDispatch();

  const clientSideRouter = useAppSelector((state) => Boolean(state.user.userClientSideRouter));

  const setClientSideRouter = useCallback(
    (newClientSideRouter: boolean) => {
      dispatch(
        updateUserClientSideRouter({
          userClientSideRouter: newClientSideRouter,
        }),
      );
    },
    [dispatch],
  );

  return [clientSideRouter, setClientSideRouter];
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }));
    },
    [dispatch],
  );
}

export function useSelectedChainNetwork(): number {
  const chainNetwork = useAppSelector((state) => state.user.chainNetwork);
  return useMemo(() => chainNetwork, [chainNetwork]);
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
    const dispatch = useAppDispatch();
    return useCallback(
        (chainId: number, address: string) => {
            dispatch(removeSerializedToken({ chainId, address }));
        },
        [dispatch],
    );
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializedToken(pair?.token0),
    token1: serializedToken(pair?.token1),
  };
}
