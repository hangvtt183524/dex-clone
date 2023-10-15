/* eslint-disable max-len */
import React, { useState } from 'react';
import { AutoColumn } from 'components/Layout/Column';
import { Token, SupportedChainId } from 'config/sdk-core';

import { useTranslation } from 'react-i18next';
import { Grid, Flex } from 'components/Box';
import Button from 'components/Button';
import { useAddUserToken } from 'state/user/hooks';
import { truncateHash } from 'utils/addressHelpers';
import { Message } from 'components/Message';
import Text from 'components/Text';
import { getExploreName, getExplorerLink } from 'utils/getExplorer';
import Link from 'components/Link';
import { Checkbox } from 'components/Checkbox';
import IconButton from 'components/Button/IconButton';
import { networks } from 'config/networks';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';

interface ImportProps {
  tokens: Token[];
  handleCurrencySelect?: (currency: Token) => void;
}

const getStandard = (chainId: SupportedChainId) =>
  chainId !== SupportedChainId.BSC && chainId !== SupportedChainId.BSC_TESTNET ? 'ERC20' : 'BEP20'; // TODO

const ImportToken = ({ tokens, handleCurrencySelect }: ImportProps) => {
  const { chainId } = useActiveWeb3React();

  const { t } = useTranslation();

  const [confirmed, setConfirmed] = useState(false);

  const addToken = useAddUserToken();

  // use for showing import source on inactive tokens
  // const inactiveTokenList = useCombinedInactiveList();

  return (
    <AutoColumn gap="lg" flex={1}>
      <Message variant="warning">
        <Text>
          {t(
            'Anyone can create a {{standard}} token on {{network}} with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.',
            {
              standard: getStandard(chainId),
              network: Object.values(networks).find((c) => c.chainId === chainId)?.networkInfo?.displayName,
            },
          )}
          <br />
          <br />
          {t('If you purchase an arbitrary token, you may be unable to sell it back.')}
        </Text>
      </Message>

      {tokens.map((token) => {
        // const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list;
        const address = token.address ? `${truncateHash(token.address)}` : null;
        return (
          <Grid key={token.address} gridTemplateRows="1fr 1fr 1fr" gridGap="4px">
            {/* {list !== undefined ? (
              <Tag
                variant="success"
                outline
                scale="sm"
                startIcon={list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
              >
                {t('via')} {list.name}
              </Tag>
            ) : (
              <Tag variant="failure" outline scale="sm" startIcon={<ErrorIcon color="failure" />}>
                {t('Unknown Source')}
              </Tag>
            )} TODO */}
            <Flex alignItems="center">
              <Text fontSize="16px" mr="8px">
                {token.name}
              </Text>
              <Text>({token?.symbol})</Text>
            </Flex>
            {chainId && (
              <Flex justifyContent="space-between" width="100%">
                <Text mr="4px">{address}</Text>
                <Link fontSize="12px" external href={getExplorerLink(token.address, 'address', chainId)}>
                  (
                  {t('View on {{site}}', {
                    site: getExploreName(chainId),
                  })}
                  )
                </Link>
              </Flex>
            )}
          </Grid>
        );
      })}

      <Flex justifyContent="space-between" alignItems="center">
        <IconButton onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            scale="sm"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Text ml="8px" style={{ userSelect: 'none' }}>
            {t('I understand')}
          </Text>
        </IconButton>
        <Button
          radius="small"
          variant="primary"
          disabled={!confirmed}
          style={{
            fontSize: '14px',
          }}
          onClick={() => {
            tokens.forEach((token) => {
              addToken(token);
            });
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0]);
            }
          }}
          className=".token-dismiss-button"
        >
          {t('Import')}
        </Button>
      </Flex>
    </AutoColumn>
  );
};

export default ImportToken;
