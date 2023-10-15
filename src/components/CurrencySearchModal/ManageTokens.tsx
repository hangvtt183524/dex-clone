import React, { useRef, RefObject, useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Row, RowBetween, RowFixed } from 'components/Layout/Row';
import { useToken } from 'hooks/Tokens';
import { Token } from 'config/sdk-core';
import Link from 'components/Link';
import { useRemoveUserAddedToken } from 'state/user/hooks';
import { getExplorerLink } from 'utils/getExplorer';
import Button from 'components/Button';
import IconButton from 'components/Button/IconButton';
import Input from 'components/Input';
import { Column, AutoColumn } from 'components/Layout/Column';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import { CloseIcon, FindIcon, StarActiveIcon, StarIcon } from 'svgs';
import Text from 'components/Text';
import { useTranslation } from 'react-i18next';
import useUserAddedTokens from 'state/user/useUserAddedTokens';
import Image from 'components/Image';
import { Box } from 'components/Box';
import { isAddress } from 'utils/addressHelpers';
import RoboTheme from 'styles';
import { useAppDispatch } from 'state/store';
import { updatePinToken } from 'state/user/actions';
import { usePinTokens } from 'state/tokens/hooks';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { CurrencyModalView } from './types';
import ImportRow from './ImportRow';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  margin-bottom: 24px;
`;

const RowTokenImported = styled(RowBetween)`
  width: 100%;
  padding: 4px 8px;
  :hover {
    background: ${({ theme }) => theme.colors.hover};
  }
  border-radius: ${({ theme }) => theme.radius.small};
`;

const ManageTokens = ({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
}) => {
  const { chainId } = useActiveWeb3React();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    setSearchQuery(input);
  }, []);

  // if they input an address, use it
  const searchToken = useToken(searchQuery);

  // all tokens for local list
  const userAddedTokens: Token[] = useUserAddedTokens();
  const removeToken = useRemoveUserAddedToken();
  const pinTokens = usePinTokens();

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.forEach((token) => {
        return removeToken(chainId, token.address);
      });
    }
  }, [removeToken, userAddedTokens, chainId]);

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => {
        const isPinToken = pinTokens?.[chainId]?.[token.address] || false;

        return (
          <RowTokenImported my="8px" key={token.address}>
            <RowFixed mr="18px">
              <CurrencyLogo currency={token} size={32} />
              <AutoColumn ml="10px" gap="4px">
                <Link
                  style={{
                    flexWrap: 'wrap',
                  }}
                  external
                  href={getExplorerLink(token.address, 'address', chainId)}
                >
                  <Text scale="md" mr="6px">
                    {token.name}
                  </Text>
                  <Text scale="md" color="textSecondary" fontWeight={300}>
                    ({token?.symbol})
                  </Text>
                </Link>
                <Text color="textSubtle" ellipsis={1} fontSize="12px">
                  {`${t('Added by user')} •`}{' '}
                </Text>
              </AutoColumn>
            </RowFixed>
            <RowFixed gap="8px">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    updatePinToken({
                      chainId,
                      currencyId: token.address,
                      isPin: !isPinToken,
                    }),
                  );
                }}
              >
                {isPinToken ? <StarActiveIcon /> : <StarIcon />}
              </IconButton>
              <Link
                external
                href={getExplorerLink(token.address, 'token', chainId)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FindIcon />
              </Link>
              <IconButton variant="text" onClick={() => removeToken(chainId, token.address)}>
                <CloseIcon fill={RoboTheme.colors.text} />
              </IconButton>
            </RowFixed>
          </RowTokenImported>
        );
      })
    );
  }, [chainId, userAddedTokens, pinTokens, t, dispatch, removeToken]);

  const isAddressValid = searchQuery === '' || isAddress(searchQuery);

  return (
    <Wrapper>
      <Column style={{ width: '100%', height: '100%', flex: '1 1' }}>
        <AutoColumn gap="14px" flex="1 1">
          <Row>
            <Input
              variant="primary"
              p="16px 20px"
              id="token-search-input"
              scale="lg"
              fontSize="14px"
              placeholder="Address: 0x0000"
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              isWarning={!isAddressValid}
            />
          </Row>
          {!isAddressValid && <Text color="failure">{t('Enter valid token address')}</Text>}
          {searchToken && (
            <ImportRow
              token={searchToken}
              showImportView={() => setModalView(CurrencyModalView.importToken)}
              setImportToken={setImportToken}
              style={{ height: 'fit-content' }}
            />
          )}
        </AutoColumn>
        {(isAddress(searchToken) || !searchToken) && (
          <Column mt="24px" justifyContent="space-between" width="100%" height="100%">
            {userAddedTokens.length > 0 ? (
              <>
                <Box>
                  <Text color="text">
                    {userAddedTokens.length === 1 ? t('Custom Token') : t('Custom Tokens')} ({userAddedTokens.length})
                  </Text>
                  <Column my="16px" overflowY="scroll" height="260px">
                    {tokenList}
                  </Column>
                </Box>
                <Button variant="disabled" scale="lg" width="100%" onClick={handleRemoveAll}>
                  {t('Clear all')}
                </Button>
              </>
            ) : (
              <Box my="40px" mx="auto">
                <Image src="/assets/images/empty-token.png" width={240} height={182} alt="empty-token" />
                <Text mt="8px" scale="sm" color="textSubtle" textAlign="center">
                  No Tokens
                </Text>
              </Box>
            )}
          </Column>
        )}
      </Column>
    </Wrapper>
  );
};

export default ManageTokens;
