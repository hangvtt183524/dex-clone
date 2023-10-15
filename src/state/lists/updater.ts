import { UNSUPPORTED_LIST_URLS } from 'config/lists';
import useInterval from 'hooks/useInterval';
import useIsWindowVisible from 'hooks/useIsWindowVisible';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useAllLists } from 'state/lists/hooks';
import { updateListVersion } from './actions';
import { useActiveListUrls } from './hooks';
import { useListState } from './reducer';
import useFetchListCallback from './useFetchListCallback';

const Updater = (): null => {
  const { provider } = useActiveWeb3React();
  const [, dispatch] = useListState();
  const isWindowVisible = useIsWindowVisible();
  const router = useRouter();
  const includeListUpdater = useMemo(() => {
    return ['/swap', '/limit-orders', 'liquidity', '/pool', '/find', '/remove'].some((item) => {
      return router.pathname.startsWith(item);
    });
  }, [router.pathname]);

  // get all loaded lists, and the active urls
  useActiveListUrls();

  const lists = useAllLists();

  useEffect(() => {
    dispatch(updateListVersion());
  }, [dispatch]);

  const fetchList = useFetchListCallback(dispatch);

  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return;
    Object.keys(lists).forEach((url) =>
      fetchList(url).catch((error) => console.debug('interval list fetching error', error)),
    );
  }, [fetchList, isWindowVisible, lists]);

  // fetch all lists every 10 minutes, but only after we initialize provider and page has currency input
  useInterval(fetchAllListsCallback, provider ? 1000 * 60 * 10 : null, true, includeListUpdater);

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error));
      }
    });
  }, [fetchList, provider, lists]);

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    Object.keys(UNSUPPORTED_LIST_URLS).forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error));
      }
    });
  }, [fetchList, provider, lists]);

  // TODO
  // automatically update lists if versions are minor/patch
  // useEffect(() => {
  //   Object.keys(lists).forEach((listUrl) => {
  //     const list = lists[listUrl];
  //     if (list.current && list.pendingUpdate) {
  //       const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version);
  //       // eslint-disable-next-line default-case
  //       switch (bump) {
  //         case VersionUpgrade.NONE:
  //           throw new Error("unexpected no version bump");
  //         // update any active or inactive lists
  //         case VersionUpgrade.PATCH:
  //         case VersionUpgrade.MINOR:
  //         case VersionUpgrade.MAJOR:
  //           dispatch(acceptListUpdate(listUrl));
  //       }
  //     }
  //   });
  // }, [dispatch, lists, activeListUrls]);

  return null;
};
export default Updater;
