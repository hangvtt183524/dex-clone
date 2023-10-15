import { Box, Grid } from 'components/Box';
import ConnectButton from 'components/ConnectButton';
import { RowCenter } from 'components/Layout/Row';
import React from 'react';
import styled from 'styled-components';
import { useAccount } from 'packages/wagmi/src';
import { RowPropsWithLoading } from '../../types';
import FarmHarvest from './FarmHarvest';
import FarmStake from './FarmStake';
import FarmUnStake from './FarmUnStake';

const ActionPanel: React.FC<RowPropsWithLoading & { expanded?: boolean }> = ({ expanded, ...props }) => {
  const { isConnected } = useAccount();
  return (
    <Container expanded={expanded}>
      {isConnected && props.details.token && props.details.manager ? (
        <StyledWrapFarmEvent>
          <FarmStake {...props} />
          <LineStroke />
          <FarmUnStake {...props} />
          <LineStroke />
          <FarmHarvest {...props} />
        </StyledWrapFarmEvent>
      ) : (
        <RowCenter height="240px">
          <ConnectButton />
        </RowCenter>
      )}
    </Container>
  );
};

const StyledWrapFarmEvent = styled(Grid)`
  grid-template-columns: 1fr;
  gap: 24px;

  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr 1px 1fr 1px 1fr;
    background: ${({ theme }) => theme.colors.form};
    padding: 24px 0;
  }
`;
const LineStroke = styled(Box)`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.colors.strokeSec};

  ${({ theme }) => theme.mediaQueries.lg} {
    height: 100%;
    width: 1px;
  }
`;

const Container = styled(Box)<{ expanded: boolean }>`
  max-height: ${({ expanded }) => (expanded ? '800px' : '0')};
  transition: 0.2s ease-in-out;

  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-height: ${({ expanded }) => (expanded ? '240px' : '')};
  }
`;
export default ActionPanel;
