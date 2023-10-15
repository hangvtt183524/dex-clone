import React, { KeyboardEvent, RefObject, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import useDebounce from 'hooks/useDebounce';
import useNativeCurrency from 'hooks/useNativeCurrency';
import { FixedSizeList } from 'react-window';
import { useAllLists, useInactiveListUrls } from 'state/lists/hooks';

import { Token, Currency } from 'config/sdk-core';
import { useTranslation } from 'react-i18next';
import useMatchBreakPoints from 'hooks/useMatchBreakPoints';
import { isAddress } from 'utils/addressHelpers';
import { Box } from 'components/Box';
import Search from 'components/Input/Search';
import { Column, AutoColumn, ColumnCenter } from 'components/Layout/Column';
import { Row } from 'components/Layout/Row';
import Text from 'components/Text';
import { deserializeToken } from 'utils/tokens';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import Image from 'components/Image/Image';
import ImportRow from './ImportRow';
import useTokenComparator from './sorting';
import { createFilterToken, useSortedTokensByQuery } from './filtering';
import CurrencyList from './CurrencyList';
import CommonBases from './CommonBases';
import { useAllTokens, useIsUserAddedToken, useToken } from '../../hooks/Tokens';

interface CurrencySearchProps {
  selectedCurrency?: Currency | null;
  handleCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  commonBasesType?: string;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  height?: number;
}

function useSearchInactiveTokenLists(search: string | undefined, minResults = 10): Token[] {
  const lists = useAllLists();
  const inactiveUrls = useInactiveListUrls();
  const { chainId } = useActiveWeb3React();

  const activeTokens = useAllTokens();

  return useMemo(() => {
    if (!search || search.trim().length === 0) return [];
    const filterToken = createFilterToken(search);
    const exactMatches: Token[] = [];
    const rest: Token[] = [];
    const addressSet: { [address: string]: true } = {};
    const trimmedSearchQuery = search.toLowerCase().trim();
    for (const url of inactiveUrls) {
      const list = lists[url].current;
      // eslint-disable-next-line no-continue
      if (!list) continue;
      for (const tokenInfo of list.tokens) {
        if (
          tokenInfo.chainId === chainId &&
          !(tokenInfo.address in activeTokens) &&
          !addressSet[tokenInfo.address] &&
          filterToken(tokenInfo)
        ) {
          const wrapped: Token = deserializeToken(tokenInfo);

          addressSet[wrapped.address] = true;
          if (
            tokenInfo.name?.toLowerCase() === trimmedSearchQuery ||
            tokenInfo.symbol?.toLowerCase() === trimmedSearchQuery
          ) {
            exactMatches.push(wrapped);
          } else {
            rest.push(wrapped);
          }
        }
      }
    }
    return [...exactMatches, ...rest].slice(0, minResults);
  }, [activeTokens, chainId, inactiveUrls, lists, minResults, search]);
}

const CurrencySearch = ({
  selectedCurrency,
  handleCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  commonBasesType,
  showImportView,
  setImportToken,
  height,
}: CurrencySearchProps) => {
  const { t } = useTranslation();
  const { chainId } = useActiveWeb3React();

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedQuery = useDebounce(searchQuery, 200);

  const allTokens = useAllTokens();

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);

  const { isMobile } = useMatchBreakPoints();

  const native = useNativeCurrency();

  const showBNB: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim();
    return native && native.symbol?.toLowerCase?.()?.indexOf(s) !== -1;
  }, [debouncedQuery, native]);

  const filteredTokens: Token[] = useMemo(() => {
    const filterToken = createFilterToken(debouncedQuery);
    return Object.values(allTokens).filter(filterToken);
  }, [allTokens, debouncedQuery]);

  const filteredQueryTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery);
  const tokenComparator = useTokenComparator(chainId);

  const filteredSortedTokens: Token[] = useMemo(() => {
    return [...filteredQueryTokens].sort(tokenComparator);
  }, [filteredQueryTokens, tokenComparator]);

  const handleCurrencySelectState = useCallback(
    (currency: Currency) => {
      handleCurrencySelect(currency);
    },
    [handleCurrencySelect],
  );

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!isMobile) inputRef.current.focus();
  }, [isMobile]);

  const handleInput = useCallback((event) => {
    const input = event.target.value?.trim();
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === native?.symbol.toLowerCase().trim()) {
          handleCurrencySelectState(native);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0]?.symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelectState(filteredSortedTokens[0]);
          }
        }
      }
    },
    [debouncedQuery, filteredSortedTokens, handleCurrencySelectState, native],
  );

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(debouncedQuery);

  const hasFilteredInactiveTokens = Boolean(filteredInactiveTokens?.length);

  const getCurrencyListRows = useCallback(() => {
    if (searchToken && !searchTokenIsAdded && !hasFilteredInactiveTokens) {
      return (
        <Column py="20px" height="100%">
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      );
    }
    return Boolean(filteredSortedTokens?.length) || hasFilteredInactiveTokens ? (
      <Box
        margin={['16px -8px', '14px -8px']}
        id="currency-list"
        height={isMobile ? (showCommonBases ? height || 400 : height ? height + 40 : 265) : 320}
      >
        <CurrencyList
          height={isMobile ? (showCommonBases ? height || 360 : height ? height + 20 : 245) : 320}
          showBNB={showBNB}
          currencies={filteredSortedTokens}
          inactiveCurrencies={filteredInactiveTokens}
          breakIndex={
            Boolean(filteredInactiveTokens?.length) && filteredSortedTokens ? filteredSortedTokens.length : undefined
          }
          handleCurrencySelect={handleCurrencySelectState}
          otherCurrency={otherSelectedCurrency}
          selectedCurrency={selectedCurrency}
          fixedListRef={fixedList}
          showImportView={showImportView}
          setImportToken={setImportToken}
        />
      </Box>
    ) : (
      <ColumnCenter p="20px" my="40px" height="100%">
        <Image src="/assets/images/empty-token.png" width={240} height={182} alt="empty-token" />
        <Text mt="16px" color="textSubtle" textAlign="center" mb="20px">
          {t('No results found.')}
        </Text>
      </ColumnCenter>
    );
  }, [
    filteredInactiveTokens,
    filteredSortedTokens,
    handleCurrencySelectState,
    hasFilteredInactiveTokens,
    otherSelectedCurrency,
    searchToken,
    searchTokenIsAdded,
    selectedCurrency,
    setImportToken,
    showBNB,
    showImportView,
    t,
    showCommonBases,
    isMobile,
    height,
  ]);

  return (
    <>
      <AutoColumn gap="20px">
        <Row>
          <Search
            width="100%"
            placeholder={t('Search name or paste address')}
            scale="lg"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
            fontSize="12px"
          />
        </Row>
        {showCommonBases && selectedCurrency && (
          <CommonBases
            chainId={chainId}
            onSelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            otherSelectedCurrency={otherSelectedCurrency}
            commonBasesType={commonBasesType}
          />
        )}
      </AutoColumn>
      {getCurrencyListRows()}
    </>
  );
};

export default CurrencySearch;
