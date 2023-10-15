import styled from 'styled-components';
import BigNumber from 'bignumber.js';

import React from 'react';
import { urlRoute } from 'config/endpoints';
import Skeleton from 'components/Skeleton';
import { Box } from 'components/Box';
import ApyButton from '../FarmAction/ApyButton';

export interface AprProps {
  value: string;
  multiplier: string;
  pid: number;
  lpLabel: string;
  lpSymbol: string;
  lpRewardsApr: number;
  tokenAddress?: string;
  quoteTokenAddress?: string;
  roboPrice: BigNumber;
  hideButton?: boolean;
  strikethrough?: boolean;
  useTooltipText?: boolean;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
`;

const AprWrapper = styled(Box)`
  text-align: center;
`;

const Apr: React.FC<React.PropsWithChildren<AprProps>> = ({
  value,
  pid,
  lpLabel,
  lpSymbol,
  multiplier,
  tokenAddress,
  quoteTokenAddress,
  roboPrice,
  hideButton = false,
  strikethrough,
  lpRewardsApr,
  useTooltipText = true,
}) => {
  return (
      <Container>
          <AprWrapper>{value}</AprWrapper>
      </Container>
  );
};

export default Apr;
