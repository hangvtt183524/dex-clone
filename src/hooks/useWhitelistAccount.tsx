import { urlRoute } from 'config/endpoints';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import WhiteListAcccount from 'config/constants/white-list.json';
import { useAccount } from 'packages/wagmi/src';

const is404Page = (page) => /404/.test(page);

export const useWhitelistAccount = () => {
  const router = useRouter();
  const { address, isReconnecting, isConnecting: isConnectingWagmi } = useAccount();

  const isConnecting = useMemo(() => isConnectingWagmi || isReconnecting, [isConnectingWagmi, isReconnecting]);

  const validateAccountWhiteList = useCallback(() => {
    const isOnWhiteList = WhiteListAcccount.accounts.includes(address);
    const is404 = is404Page(window.location.pathname);
    const queryFrom = router.query?.from?.toString();

    if (isOnWhiteList) {
      if (is404 && !is404Page(queryFrom)) {
        router.push(queryFrom || urlRoute.swap().path);
      }
    } else if (!is404) {
      router.push(`/404?from=${router.asPath}`);
    }
  }, [address, router]);

  useEffect(() => {
    if (!isConnecting) {
      validateAccountWhiteList();
    }
  }, [isConnecting, address, validateAccountWhiteList]);
};
