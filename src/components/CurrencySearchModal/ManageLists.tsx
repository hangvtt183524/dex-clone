import Button from 'components/Button';
import { Card } from 'components/Card';
import Input from 'components/Input';
import { AutoColumn, Column } from 'components/Layout/Column';
import { Row, RowBetween, RowFixed } from 'components/Layout/Row';
import LinkExternal from 'components/Link/LinkExternal';
import ListLogo from 'components/Logo/ListLogo';
import Text from 'components/Text';
import Toggle from 'components/Toggle';
import { UNSUPPORTED_LIST_URLS } from 'config/lists';
import { TokenList } from 'config/types/lists';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import useTooltip from 'hooks/useTooltip';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { acceptListUpdate, removeList, enableList, disableList } from 'state/lists/actions';
import { useIsListActive, selectorByUrlsAtom, useAllLists, useActiveListUrls } from 'state/lists/hooks';
import { useListState, listsAtom } from 'state/lists/reducer';
import useFetchListCallback from 'state/lists/useFetchListCallback';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { CheckMarkIcon, LinkExternalIcon } from 'svgs';
import uriToHttp from 'utils/uriToHttp';

import { Box } from 'components/Box';
import Image from 'components/Image';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { CurrencyModalView } from './types';

function listVersionLabel(version): string {
  return `v${version.major}.${version.minor}.${version.patch}`;
}

const Wrapper = styled(Column)`
  width: 100%;
  height: 100%;
`;

const RowWrapper = styled(Row)<{ active: boolean; hasActiveTokens: boolean }>`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  align-items: center;
  padding: 1rem 20px;
  border-radius: ${({ theme }) => theme.radius.small};
`;

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`;
}

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
  const { chainId } = useActiveWeb3React();

  const { t } = useTranslation();
  const isActive = useIsListActive(listUrl);
  const { isDesktop } = useMatchBreakpoints();

  const listsByUrl = useAtomValue(selectorByUrlsAtom);
  const [, dispatch] = useListState();
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl];

  const activeTokensOnThisChain = useMemo(() => {
    if (!list || !chainId) {
      return 0;
    }
    return list.tokens.reduce((acc, cur) => (cur.chainId === chainId ? acc + 1 : acc), 0);
  }, [chainId, list]);

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return;
    dispatch(acceptListUpdate(listUrl));
  }, [dispatch, listUrl, pending]);

  const handleRemoveList = useCallback(() => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Please confirm you would like to remove this list')) {
      dispatch(removeList(listUrl));
    }
  }, [dispatch, listUrl]);

  const handleEnableList = useCallback(() => {
    dispatch(enableList(listUrl));
  }, [dispatch, listUrl]);

  const handleDisableList = useCallback(() => {
    dispatch(disableList(listUrl));
  }, [dispatch, listUrl]);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <AutoColumn gap="8px">
      <Row>
        <Text fontSize="12px" mr="4px">
          {list && listVersionLabel(list.version)}
        </Text>
        <LinkExternal fontSize="12px" external href={`https://tokenlists.org/token-list?url=${listUrl}`}>
          {t('See')}
        </LinkExternal>
      </Row>
      <RowFixed gap="4px">
        <Button
          variant="danger"
          scale="xs"
          onClick={handleRemoveList}
          disabled={Object.keys(listsByUrl).length === 1}
          style={{
            borderRadius: RoboTheme.radius.small,
            fontSize: '10px',
          }}
        >
          {t('Remove')}
        </Button>
        {pending && (
          <Button
            scale="xs"
            onClick={handleAcceptListUpdate}
            style={{
              borderRadius: RoboTheme.radius.small,
              fontSize: '10px',
            }}
          >
            {t('Update list')}
          </Button>
        )}
      </RowFixed>
    </AutoColumn>,
    {
      placement: isDesktop ? 'right-end' : 'top',
      trigger: 'hover',
      background: RoboTheme.colors.hover,
      tooltipOffset: [0, 0],
    },
  );

  if (!list) return null;

  return (
    <RowWrapper
      active={isActive}
      hasActiveTokens={activeTokensOnThisChain > 0}
      key={listUrl}
      id={listUrlRowHTMLId(listUrl)}
      ref={targetRef}
    >
      {tooltipVisible && tooltip}
      {list.logoURI ? (
        <ListLogo size={42} style={{ marginRight: '1rem' }} logoURI={list.logoURI} alt={`${list.name} list logo`} />
      ) : (
        <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          <Text scale="md" fontWeight={500}>
            {list.name}
          </Text>
        </Row>
        <RowFixed mt="4px">
          <Text fontSize="12px" mr="6px" fontWeight={400} color="textSubtle" textTransform="lowercase">
            {list.tokens.length} {t('Tokens')}
          </Text>
          <LinkExternalIcon fill={RoboTheme.colors.textSubtle} />
        </RowFixed>
      </Column>
      <Toggle
        checked={isActive}
        onClick={() => {
          if (isActive) {
            handleDisableList();
          } else {
            handleEnableList();
          }
        }}
      />
    </RowWrapper>
  );
});

const ListContainer = styled.div`
  padding: 1rem 0;
  height: 100%;
  overflow: auto;
`;

const ManageLists = ({
  setModalView,
  setImportList,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) => {
  const [listUrlInput, setListUrlInput] = useState<string>('');

  const { t } = useTranslation();

  const lists = useAllLists();

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls();
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>();
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls);
    }
  }, [activeCopy, activeListUrls]);

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value);
  }, []);

  const fetchList = useFetchListCallback(listsAtom);

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0;
  }, [listUrlInput]);

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists);
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        return Boolean(lists[listUrl].current) && !UNSUPPORTED_LIST_URLS.includes(listUrl);
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1];
        const { current: l2 } = lists[u2];

        // first filter on active lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1;
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1;
        }

        if (l1 && l2) {
          // Always make PancakeSwap list in top.
          const keyword = 'pancakeswap';
          if (l1.name.toLowerCase().includes(keyword) || l2.name.toLowerCase().includes(keyword)) {
            return -1;
          }

          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1;
        }
        if (l1) return -1;
        if (l2) return 1;
        return 0;
      });
  }, [lists, activeCopy]);
  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>();
  const [addError, setAddError] = useState<string | undefined>();

  useEffect(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError('Error importing list'));
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList();
    } else {
      setTempList(undefined);
      if (listUrlInput !== '') {
        setAddError('Enter valid list location');
      }
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined);
    }
  }, [fetchList, listUrlInput, validUrl]);

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput);

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return;
    setImportList(tempList);
    setModalView(CurrencyModalView.importList);
    setListUrl(listUrlInput);
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList]);

  return (
    <Wrapper>
      <AutoColumn gap="14px">
        <Row>
          <Input
            variant="primary"
            p="16px 20px"
            id="list-add-input"
            scale="lg"
            fontSize="14px"
            placeholder={t('https:// or ipfs://')}
            value={listUrlInput}
            onChange={handleInput}
          />
        </Row>
        {addError ? (
          <Text color="failure" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {addError}
          </Text>
        ) : null}
      </AutoColumn>

      <ListContainer>
        <AutoColumn gap="md">
          {sortedLists.length > 0
            ? sortedLists.map((listUrl) => <ListRow key={listUrl} listUrl={listUrl} />)
            : !tempList && (
                <Box my="40px" mx="auto">
                  <Image src="/assets/images/empty-token.png" width={240} height={182} alt="empty-token" />
                  <Text mt="16px" scale="sm" color="textSubtle" textAlign="center">
                    No Lists Token
                  </Text>
                </Box>
              )}
        </AutoColumn>
      </ListContainer>

      <AutoColumn mt="24px">
        {tempList && (
          <Card padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {tempList.logoURI && <ListLogo logoURI={tempList.logoURI} size={40} />}
                <AutoColumn gap="4px" style={{ marginLeft: '20px' }}>
                  <Text bold>{tempList.name}</Text>
                  <Text color="textSubtle" textTransform="lowercase">
                    {tempList.tokens.length} {t('Tokens')}
                  </Text>
                </AutoColumn>
              </RowFixed>
              {isImported ? (
                <RowFixed>
                  <CheckMarkIcon width="16px" mr="10px" />
                  <Text>{t('Loaded')}</Text>
                </RowFixed>
              ) : (
                <Button width="fit-content" onClick={handleImport}>
                  {t('Import')}
                </Button>
              )}
            </RowBetween>
          </Card>
        )}
      </AutoColumn>
    </Wrapper>
  );
};

export default ManageLists;
