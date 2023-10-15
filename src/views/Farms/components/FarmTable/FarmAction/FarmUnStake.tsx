import { Flex } from 'components/Box';
import ActionButton from 'components/Button/ActionButton';
import { Column } from 'components/Layout/Column';
import Text from 'components/Text';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Dots } from 'styles/common';
import { getNow } from 'utils/dateHelper';
import { isNaNZero, parseNumberDisplay } from 'utils/numbersHelper';
import useUnstakeFarms from '../../hooks/useUnstakeFarms';
import { RowPropsWithLoading } from '../../types';

const Wrapper = styled(Column)``;

const FarmUnStake: React.FC<RowPropsWithLoading> = ({ details, locktime }) => {
  const lpStakeBalance = useMemo(
    () => parseNumberDisplay(details?.userData?.stakedBalance, 18, details.lpTokenDecimals),
    [details],
  );

  const { onUnstake, pendingTxn } = useUnstakeFarms(details.manager, details.poolId);

  const handleUnStake = () => {
    return onUnstake(details?.userData?.stakedBalance.toString()).then(() => {});
  };

  return (
    <Wrapper>
      <Column flex={1}>
        <Text color="textSubtle" fontSize="12px" mb="12px">
          My LP Staked:
        </Text>
        <Text fontWeight={600}>{lpStakeBalance}</Text>
      </Column>
      <Flex my={['8px', '8px', '18px']} maxHeight={52} />

      <ActionButton
        width="100%"
        disabled={isNaNZero(details?.userData?.stakedBalance) || pendingTxn || locktime?.lockTime > getNow()}
        style={{
          fontSize: '14px',
        }}
        onSubmit={handleUnStake}
      >
        {pendingTxn ? <Dots>Unstaking</Dots> : 'Unstake'}
      </ActionButton>
    </Wrapper>
  );
};

export default FarmUnStake;
