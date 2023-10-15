/* eslint-disable max-len */
import { Flex } from 'components/Box';
import Button from 'components/Button';
import IconButton from 'components/Button/IconButton';
import { Card } from 'components/Card';
import { Checkbox } from 'components/Checkbox';
import { AutoColumn } from 'components/Layout/Column';
import { RowBetween, RowFixed } from 'components/Layout/Row';
import Link from 'components/Link';
import ListLogo from 'components/Logo/ListLogo';
import { Message } from 'components/Message';
import Text from 'components/Text';
import { TokenList } from 'config/types/lists';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useState } from 'react';
import { enableList, removeList } from 'state/lists/actions';
import { useAllLists } from 'state/lists/hooks';
import { useListState } from 'state/lists/reducer';
import useFetchListCallback from 'state/lists/useFetchListCallback';
import styled from 'styled-components';

interface ImportProps {
  listURL: string;
  list: TokenList;
  onImport: () => void;
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TextDot = styled.div`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
`;

const ImportList = ({ listURL, list, onImport }: ImportProps) => {
  const data = useListState();
  const [, dispatch] = data;
  const { t } = useTranslation();

  // user must accept
  const [confirmed, setConfirmed] = useState(false);

  const lists = useAllLists();
  const fetchList = useFetchListCallback(dispatch);

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddList = useCallback(() => {
    if (adding) return;
    setAddError(null);
    fetchList(listURL)
      .then(() => {
        dispatch(enableList(listURL));
        onImport();
      })
      .catch((error) => {
        setAddError(error.message);
        dispatch(removeList(listURL));
      });
  }, [adding, dispatch, fetchList, listURL, onImport]);

  return (
    <Wrapper>
      <AutoColumn gap="md">
        <AutoColumn gap="md">
          <Card padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {list.logoURI && <ListLogo logoURI={list.logoURI} size={40} />}
                <AutoColumn gap="sm" style={{ marginLeft: '20px' }}>
                  <RowFixed>
                    <Text bold mr="6px">
                      {list.name}
                    </Text>
                    <TextDot />
                    <Text fontSize="12px" color="textSubtle" ml="6px">
                      {list.tokens.length} tokens
                    </Text>
                  </RowFixed>
                  <Link
                    fontSize="12px"
                    external
                    ellipsis={1}
                    maxWidth="90%"
                    href={`https://tokenlists.org/token-list?url=${listURL}`}
                  >
                    {listURL}
                  </Link>
                </AutoColumn>
              </RowFixed>
            </RowBetween>
          </Card>

          <Message variant="failure">
            <Flex flexDirection="column">
              <Text fontSize="20px" textAlign="center" color="failure" mb="16px">
                {t('Import at your own risk')}
              </Text>
              <Text color="failure" mb="8px">
                {t(
                  'By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one.',
                )}
              </Text>
              <Text bold color="failure" mb="16px">
                {t('If you purchase a token from this list, you may not be able to sell it back.')}
              </Text>
              <IconButton radius="small">
                <Checkbox name="confirmed" checked={confirmed} onChange={() => setConfirmed(!confirmed)} scale="sm" />
                <Text ml="10px" style={{ userSelect: 'none' }}>
                  {t('I understand')}
                </Text>
              </IconButton>
            </Flex>
          </Message>

          <Button mt="auto" radius="small" disabled={!confirmed} onClick={handleAddList}>
            {t('Import')}
          </Button>
          {addError ? (
            <Text color="failure" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {addError}
            </Text>
          ) : null}
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  );
};

export default ImportList;
