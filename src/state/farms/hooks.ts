import { useAppDispatch, useAppSelector } from 'state/store';
import {
  FarmSortOptionEnum,
} from 'packages/farms/types';
import { deserializeFarm } from 'packages/farms/utils/deserializeFarm';
import { useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useAccount, useWeb3React } from 'packages/wagmi/src';
import { useSignMessage } from 'wagmi';
import useAuth from 'hooks/useAuth';
import { getCookie, setCookie } from 'utils/cookies';
import { getNonce, performLogin, register } from 'utils/connect';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import {
    fetchFarmsPublicDataAsync,
    updateFarmQuery,
    updateFarmSort, updateLoadingFarmData,
} from './actions';
import {
  makeBusdPriceFromPidSelector,
  makeLpTokenPriceFromLpSymbolSelector,
} from './selectors';
import { useSelectedChainNetwork } from '../user/hooks';

export const useFetchFarmWithUserData = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { logout } = useAuth();
  const { connector } = useWeb3React();

  const handleFetch = useCallback(async () => {
      if (address && isConnected && connector && chainId) {
          try {
              if (!getCookie('idToken')) {
                  dispatch(updateLoadingFarmData(true));

                  let nonce = await getNonce(address);

                  if (nonce === '') {
                      const signUpResult = await register(address);
                      nonce = signUpResult ? signUpResult.nonce : '';
                  }

                  if (nonce !== '') {
                      const message = `Welcome to Robo Global Investment!\n\n Click to sign with nonce: ${nonce}.\nIt means that I accept RGI Terms of Service https://roboglobal.info/term\n\n Happy discovery!`;
                      const signMessageData = await signMessageAsync({ message });
                      if (signMessageData) {
                          const performLoginResult = await performLogin(address, signMessageData);
                          if (performLoginResult) {
                              setCookie('idToken', performLoginResult?.data?.idToken, 60 * 60);
                              setTimeout(async () => {
                                  await dispatch(fetchFarmsPublicDataAsync({ account: address, chainId }));
                                  dispatch(updateLoadingFarmData(false));
                              }, 1000);
                          }
                      } else {
                          dispatch(updateLoadingFarmData(false));
                          await logout();
                      }
                  }
              } else {
                  dispatch(updateLoadingFarmData(true));
                  await dispatch(fetchFarmsPublicDataAsync({ account: address, chainId }));
                  dispatch(updateLoadingFarmData(false));
              }
          } catch (error) {
              dispatch(updateLoadingFarmData(false));
              await logout();
          }
      }
  }, [address, chainId, isConnected, connector, dispatch, signMessageAsync, logout]);

  return useMemo(() => handleFetch, [handleFetch]);
};

export const useFarms = (): any => {
  const farms = useAppSelector((state) => state.farms);
  const chainId = useSelectedChainNetwork();

  const deserializedFarmsData = useMemo(
    () => {
      const farmsWithChainId = farms.data?.[chainId] ?
          farms.data?.[chainId].map((farm) => {
            return {
              ...farm,
              chainId,
            }
          }) : [];

      return (farms.data?.[chainId] ? (farmsWithChainId.map(deserializeFarm) as any[]) : []);
    },
    [chainId, farms],
  );
  const { loadArchivedFarmsData, userDataLoaded, poolLength, loadingFarmData } = farms;

  return useMemo(
    () => ({
      loadArchivedFarmsData,
      userDataLoaded,
      data: deserializedFarmsData,
      poolLength,
      loadingFarmData
    }),
    [deserializedFarmsData, loadArchivedFarmsData, poolLength, userDataLoaded, loadingFarmData],
  );
};

export function useFarmQuery(): [string, (query: string) => void] {
  const dispatch = useAppDispatch();
  const farmQuery = useAppSelector((state) => {
    return state.farms.farmQuery;
  });

  const setFarmQuery = useCallback(
    (query: string) => {
      dispatch(updateFarmQuery(query));
    },
    [dispatch],
  );
  return [farmQuery, setFarmQuery];
}

export function useFarmSelectSortOptions(): [string, (query: FarmSortOptionEnum) => void] {
  const dispatch = useAppDispatch();
  const sortOption = useAppSelector((state) => {
    return state.farms.sortOption;
  });

  const setSortOption = useCallback(
    (query: FarmSortOptionEnum) => {
      dispatch(updateFarmSort(query));
    },
    [dispatch],
  );

  return [sortOption, setSortOption];
}

export const useFarmsPoolLength = (): number => {
  return useAppSelector((state) => state.farms.poolLength);
};

// export const useFarmFromLpSymbol = (lpSymbol: string): DeserializedFarm => {
//   const farmFromLpSymbol = useMemo(() => farmFromLpSymbolSelector(lpSymbol), [lpSymbol]);
//   return useAppSelector(farmFromLpSymbol);
// };

// export const useFarmUser = (pid): DeserializedFarmUserData => {
//   const farmFromPidUser = useMemo(() => makeUserFarmFromPidSelector(pid), [pid]);
//   return useAppSelector(farmFromPidUser);
// };

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const busdPriceFromPid = useMemo(() => makeBusdPriceFromPidSelector(pid), [pid]);
  return useAppSelector(busdPriceFromPid);
};

export const useLpTokenPrice = (symbol: string) => {
  const lpTokenPriceFromLpSymbol = useMemo(() => makeLpTokenPriceFromLpSymbolSelector(symbol), [symbol]);
  return useAppSelector(lpTokenPriceFromLpSymbol);
};

/**
 * @deprecated use the BUSD hook in /hooks
 */
// export const usePriceCakeBusd = ({ forceMainnet } = { forceMainnet: false }): BigNumber => {
//   const price = useCakeBusdPrice({ forceMainnet });
//   return useMemo(() => (price ? new BigNumber(price.toSignificant(6)) : BIG_ZERO), [price]);
// };
