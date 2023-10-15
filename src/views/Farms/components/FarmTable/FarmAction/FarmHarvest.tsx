import BigNumber from 'bignumber.js';
import { Flex } from 'components/Box';
import ActionButton from 'components/Button/ActionButton';
import { Column } from 'components/Layout/Column';
import { RowFixed } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import Text from 'components/Text';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Dots } from 'styles/common';
import { getFullDecimals, isNaNZero, parseNumberDisplay } from 'utils/numbersHelper';
import { findFarmByManagerAddress } from 'utils/farms';
import { Token } from 'config/sdk-core';
import { deserializeToken } from 'utils/tokens';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { getTokenByAddressInChain } from 'utils/tokenHelpers';
import useHarvestFarm from '../../hooks/useHarvestFarm';
import { RowPropsWithLoading } from '../../types';

const Wrapper = styled(Column)``;

const FarmHarvest: React.FC<RowPropsWithLoading> = ({ earned, details }) => {
  const { chainId } = useActiveWeb3React();

  const reward: Token = useMemo(
    () => deserializeToken(getTokenByAddressInChain(chainId, details?.rewards)) || ({} as Token),
    [chainId, details],
  );

  const earnedBalance = useMemo(
    () => parseNumberDisplay(new BigNumber(earned?.earnings), 10, reward?.decimals),

    [earned, reward],
  );
  const { onReward, pendingTxn } = useHarvestFarm(details.manager, details.poolId);

  const handleHarvet = () => {
    return onReward(getFullDecimals(earned?.earnings, 0).toString()).then((result) =>{
    }).catch((error) => {
        console.log('error: ', error)
    });
  };

  return (
    <Wrapper>
      <Column flex={1}>
        <Text color="textSubtle" fontSize="12px" mb="12px">
          Rewards Earned
        </Text>
        <RowFixed>
          <CurrencyLogo currency={reward} size={28} />
          <Text ml="4px" fontWeight={600}>
            {earnedBalance} {reward.symbol}
          </Text>
        </RowFixed>
      </Column>
      <Flex my={['8px', '8px', '18px']} maxHeight={52} className="select-input-token" />
      <ActionButton
        width="100%"
        disabled={pendingTxn || isNaNZero(earned?.earnings)}
        style={{
          fontSize: '14px',
        }}
        onSubmit={handleHarvet}
      >
        {pendingTxn ? <Dots>Harvesting</Dots> : 'Harvest'}
      </ActionButton>
    </Wrapper>
  );
};

export default FarmHarvest;
