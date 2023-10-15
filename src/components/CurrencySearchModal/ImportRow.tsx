import React, { CSSProperties } from 'react';
import { AutoRow, RowFixed } from 'components/Layout/Row';
import { AutoColumn } from 'components/Layout/Column';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import { useCombinedInactiveList } from 'state/lists/hooks';
import styled from 'styled-components';
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens';
import { CheckMarkIcon } from 'svgs';
import useMatchBreakPoints from 'hooks/useMatchBreakPoints';
import { useTranslation } from 'react-i18next';
import Text from 'components/Text';
import Button from 'components/Button';
import { Token } from 'config/sdk-core';
import ListLogo from 'components/Logo/ListLogo';
import RoboTheme from 'styles';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 8px 0;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 6px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 12px;
  }
`;

const CheckIcon = styled(CheckMarkIcon)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.colors.success};
`;

const ImportRow = ({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token;
  style?: CSSProperties;
  dim?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}) => {
  // globals
  const { chainId } = useActiveWeb3React();

  const { isMobile } = useMatchBreakPoints();

  const { t } = useTranslation();

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList();
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list;

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);

  return (
    <TokenSection style={style}>
      <CurrencyLogo currency={token} size={isMobile ? 26 : 32} style={{ opacity: dim ? '0.6' : '1' }} />
      <AutoColumn gap="4px" style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow>
          <Text scale="md" fontWeight={500}>
            {token.name}
          </Text>
          <Text color="textDisabled">
            <Text scale="md" fontWeight={400} color={isMobile ? 'text' : 'textSubtle'} ml="4px">
              {token?.symbol}
            </Text>
          </Text>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed>
            <Text fontSize={isMobile ? '10px' : '14px'} mr="4px" color="textSubtle">
              {t('via')} {list.name}
            </Text>
            <ListLogo logoURI={list.logoURI} size={12} />
          </RowFixed>
        )}
      </AutoColumn>
      {!isActive && !isAdded ? (
        <Button
          scale="sm"
          style={{
            borderRadius: RoboTheme.radius.small,
            fontSize: '14px',
          }}
          width="fit-content"
          onClick={() => {
            if (setImportToken) {
              setImportToken(token);
            }
            showImportView();
          }}
        >
          {t('Import')}
        </Button>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <Text color="success">Active</Text>
        </RowFixed>
      )}
    </TokenSection>
  );
};
export default ImportRow;
