import {
  DEFAULT_LIST_OF_LISTS,
  DEFAULT_TOKEN_LIST,
  OFFICIAL_LISTS,
  UNSUPPORTED_LIST_URLS,
  UNSUPPORTED_TOKEN_LIST,
  WARNING_LIST_URLS,
  WARNING_TOKEN_LIST,
} from 'config/lists';
import { SupportedChainId } from 'config/sdk-core';
import { EMPTY_LIST, TokenList, TokenAddressMap } from 'config/types/lists';
import { SerializedToken } from 'config/types/token';
import { atom, useAtomValue } from 'jotai';
import { mapValues, groupBy, uniqBy, keyBy } from 'lodash';
import { useMemo } from 'react';
import { listsAtom } from './reducer';
import { ListsState } from './types';

// use ordering of default list of lists to assign priority
function sortByListPriority(urlA: string, urlB: string) {
  const first = DEFAULT_LIST_OF_LISTS.includes(urlA) ? DEFAULT_LIST_OF_LISTS.indexOf(urlA) : Number.MAX_SAFE_INTEGER;
  const second = DEFAULT_LIST_OF_LISTS.includes(urlB) ? DEFAULT_LIST_OF_LISTS.indexOf(urlB) : Number.MAX_SAFE_INTEGER;

  // need reverse order to make sure mapping includes top priority last
  if (first < second) return 1;
  if (first > second) return -1;
  return 0;
}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

// -------------------------------------
//   Selectors
// -------------------------------------
const selectorActiveUrlsAtom = atom((get) => get(listsAtom)?.activeListUrls ?? []);
export const selectorByUrlsAtom = atom((get) => get(listsAtom)?.byUrl ?? {});

const activeListUrlsAtom = atom((get) => {
  const urls = get(selectorActiveUrlsAtom);
  return urls?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url));
});

const combineTokenMapsWithDefault = (lists: ListsState['byUrl'], urls: string[]) => {
  const defaultTokenMap = listToTokenMap(DEFAULT_TOKEN_LIST);
  if (!urls) return defaultTokenMap;

  return combineMaps(combineTokenMaps(lists, urls), defaultTokenMap);
};

const combineTokenMaps = (lists: ListsState['byUrl'], urls: string[]) => {
  if (!urls) return EMPTY_LIST;
  return (
    urls
      .slice()
      // sort by priority so top priority goes last
      .sort(sortByListPriority)
      .reduce((allTokens, currentUrl) => {
        const current = lists[currentUrl]?.current;
        if (!current) return allTokens;
        try {
          const newTokens = Object.assign(listToTokenMap(current));
          return combineMaps(allTokens, newTokens);
        } catch (error) {
          console.error('Could not show token list due to error', error);
          return allTokens;
        }
      }, EMPTY_LIST)
  );
};

export const combinedTokenMapFromActiveUrlsAtom = atom((get) => {
  const [selectorByUrls, selectorActiveUrls] = [get(selectorByUrlsAtom), get(selectorActiveUrlsAtom)];
  return combineTokenMapsWithDefault(selectorByUrls, selectorActiveUrls);
});

const inactiveUrlAtom = atom((get) => {
  const [lists, urls] = [get(selectorByUrlsAtom), get(selectorActiveUrlsAtom)];
  return Object.keys(lists).filter((url) => !urls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url));
});

export const combinedTokenMapFromInActiveUrlsAtom = atom((get) => {
  const [lists, inactiveUrl] = [get(selectorByUrlsAtom), get(inactiveUrlAtom)];
  return combineTokenMaps(lists, inactiveUrl);
});

export const combinedTokenMapFromOfficialsUrlsAtom = atom((get) => {
  const lists = get(selectorByUrlsAtom);
  return combineTokenMapsWithDefault(lists, OFFICIAL_LISTS);
});

export const tokenListFromOfficialsUrlsAtom = atom((get) => {
  const lists: ListsState['byUrl'] = get(selectorByUrlsAtom);

  const mergedTokenLists: SerializedToken[] = OFFICIAL_LISTS.reduce((acc, url) => {
    if (lists?.[url]?.current?.tokens) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      acc.push(...lists?.[url]?.current.tokens);
    }
    return acc;
  }, []);

  const mergedList =
    mergedTokenLists.length > 0 ? [...DEFAULT_TOKEN_LIST.tokens, ...mergedTokenLists] : DEFAULT_TOKEN_LIST.tokens;
  return mapValues(
    groupBy(
      uniqBy(mergedList, (tokenInfo) => `${tokenInfo.chainId}#${tokenInfo.address}`),
      'chainId',
    ),
    (tokenInfos) => keyBy(tokenInfos, 'address'),
  );
});

export const combinedTokenMapFromUnsupportedUrlsAtom = atom((get) => {
  const lists = get(selectorByUrlsAtom);
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST);
  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = combineTokenMaps(lists, UNSUPPORTED_LIST_URLS);

  return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap);
});

export const combinedTokenMapFromWarningUrlsAtom = atom((get) => {
  const lists = get(selectorByUrlsAtom);
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(WARNING_TOKEN_LIST);
  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = combineTokenMaps(lists, WARNING_LIST_URLS);

  return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap);
});

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null;

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list);
  if (result) return result;

  const tokenMap: SerializedToken[] = uniqBy(list.tokens, (tokenInfo) => `${tokenInfo.chainId}#${tokenInfo.address}`);
  const groupedTokenMap: { [chainId: string]: SerializedToken[] } = groupBy(tokenMap, 'chainId');

  const tokenAddressMap = mapValues(groupedTokenMap, (tokenInfoList) =>
    mapValues(keyBy(tokenInfoList, 'address'), (tokenInfo) => ({
      token: tokenInfo,
      list,
    })),
  ) as TokenAddressMap;

  // add chain id item if not exist
  enumKeys(SupportedChainId).forEach((chainId) => {
    if (!(SupportedChainId[chainId] in tokenAddressMap)) {
      Object.defineProperty(tokenAddressMap, SupportedChainId[chainId], {
        value: {},
      });
    }
  });

  listCache?.set(list, tokenAddressMap);
  return tokenAddressMap;
}

// -------------------------------------
//   Hooks
// -------------------------------------
export function useAllLists(): {
  readonly [url: string]: {
    readonly current: TokenList | null;
    readonly pendingUpdate: TokenList | null;
    readonly loadingRequestId: string | null;
    readonly error: string | null;
  };
} {
  return useAtomValue(selectorByUrlsAtom);
}

function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  // ADD NETWORK
  return {
    [SupportedChainId.MAINNET]: {
      ...map1[SupportedChainId.MAINNET],
      ...map2[SupportedChainId.MAINNET],
    },

    [SupportedChainId.SEPOLIA]: {
      ...map1[SupportedChainId.SEPOLIA],
      ...map2[SupportedChainId.SEPOLIA],
    },

    [SupportedChainId.POLYGON]: {
      ...map1[SupportedChainId.POLYGON],
      ...map2[SupportedChainId.POLYGON],
    },
    [SupportedChainId.POLYGON_MUMBAI]: {
      ...map1[SupportedChainId.POLYGON_MUMBAI],
      ...map2[SupportedChainId.POLYGON_MUMBAI],
    },
    [SupportedChainId.BSC]: {
      ...map1[SupportedChainId.BSC],
      ...map2[SupportedChainId.BSC],
    },
    [SupportedChainId.BSC_TESTNET]: {
      ...map1[SupportedChainId.BSC_TESTNET],
      ...map2[SupportedChainId.BSC_TESTNET],
    },
  };
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  return useAtomValue(activeListUrlsAtom);
}

export function useInactiveListUrls() {
  return useAtomValue(inactiveUrlAtom);
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeTokens = useAtomValue(combinedTokenMapFromActiveUrlsAtom);
  return activeTokens;
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  return useAtomValue(combinedTokenMapFromInActiveUrlsAtom);
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  return useAtomValue(combinedTokenMapFromUnsupportedUrlsAtom);
}

// list of warning tokens on interface, used to show warnings and prevent adds
export function useWarningTokenList(): TokenAddressMap {
  return useAtomValue(combinedTokenMapFromWarningUrlsAtom);
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls();
  return useMemo(() => Boolean(activeListUrls?.includes(url)), [activeListUrls, url]);
}
