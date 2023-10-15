import { Box } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import Link from 'components/Link';
import CircleLoader from 'components/Loader/CircleLoaderMini';
import Text from 'components/Text';
import React, { useMemo } from 'react';
import { TransactionDetails } from 'state/transactions/types';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { CloseIcon, SuccessIcon, WarningInfoIcon } from 'svgs';
import { getExplorerLink } from 'utils/getExplorer';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import LogoView from './LogoView';
import TransactionBody from './TransactionBody';
import { TransactionState } from './types';

const TransactionStatus = ({ transactionDetails }: { transactionDetails: TransactionDetails }) => {
  const { chainId } = useActiveWeb3React();

  const tx = transactionDetails;
  const { info, receipt, hash } = tx;
  const explorer = getExplorerLink(hash, 'transaction', chainId);
  const transactionState = useMemo(() => {
    const pending = !receipt;
    const success = !pending && tx && (receipt?.status === 1 || typeof receipt?.status === 'undefined');
    const transactionState = pending
      ? TransactionState.Pending
      : success
      ? TransactionState.Success
      : TransactionState.Failed;

    return transactionState;
  }, [receipt, tx]);

  // const removeTransactionCallback = useCallback(() => {
  //   if (chainId) dispatch(removeTxn({ chainId, hash: tx.hash }));
  // }, [chainId, dispatch, tx]);

  return chainId ? (
    <WrapLink href={explorer} target="_blank">
      <LogoView info={info} />
      <Text as="span">
        <TransactionBody info={info} transactionState={transactionState} />
      </Text>
      <Box position="relative" ml="4px">
        {transactionState === TransactionState.Pending ? (
          <IconButton>
            <CircleLoader stroke={RoboTheme.colors.warning} />
          </IconButton>
        ) : transactionState === TransactionState.Success ? (
          <IconButton>
            <SuccessIcon fill={RoboTheme.colors.success} size="16px" />
          </IconButton>
        ) : (
          <IconButton>
            <WarningInfoIcon fill={RoboTheme.colors.warning} size="16px" />
          </IconButton>
        )}
      </Box>
    </WrapLink>
  ) : null;
};
const StyledRemoveTxn = styled(CloseIcon)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 2px;

  visibility: hidden;
`;

const StyledWrapIconStatus = styled(Box)``;

const WrapLink = styled(Link)`
  cursor: pointer;
  display: grid;
  align-items: center;
  position: relative;
  grid-template-columns: 44px auto 24px;
  width: 100%;
  text-decoration: none;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 12px 24px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    transition: 250ms background-color ease;
    /* 
    ${StyledRemoveTxn} {
      visibility: visible;
    }
    ${StyledWrapIconStatus} {
      visibility: hidden;
    } */
  }
`;

export default TransactionStatus;
