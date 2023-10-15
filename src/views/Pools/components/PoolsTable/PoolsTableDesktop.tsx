/* eslint-disable react/no-array-index-key */
import Table from 'components/Table';
import { TableBody, Td, Thead, Tr } from 'components/Table/Cell';
import React from 'react';
import styled from 'styled-components';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import { PoolTableProps } from './types';
import PoolRowDesktop from './PoolRowDesktop';

const PoolsTableDesktop: React.FC<PoolTableProps> = ({ pairs, stakingInfosWithBalance }) => {
  const { isDesktop, isXxl } = useMatchBreakpoints();

  const hideVolumn = !isDesktop;
  const hideTVL = !isDesktop && !isXxl;

  return (
    <Table width="100%" mb="32px" style={{ borderRadius: 0 }}>
      <StyledTHead background="transparent">
        <Tr>
          <StyledTd
            style={{
              textAlign: 'left',
            }}
          >
            LP pairs
          </StyledTd>
          <StyledTd>Pool</StyledTd>
          {!hideTVL && <StyledTd>TVL</StyledTd>}
          {!hideVolumn && <StyledTd>24H Volume</StyledTd>}
          <StyledTd>APR</StyledTd>
          {true && <StyledTd>Fee (24h)</StyledTd>}
          <StyledTd />
        </Tr>
      </StyledTHead>
      <TableBody background="transparent">
        {pairs.map(
          (stakingPair, i) =>
            stakingPair && (
              <PoolRowDesktop
                p="24px"
                key={`${stakingInfosWithBalance?.[i]?.stakingRewardAddress}-0x${i}`}
                pair={stakingPair}
                stakedBalance={stakingInfosWithBalance?.[i]?.stakedAmount}
                hideTLV={hideTVL}
                hideFee={false}
                hideVolume={hideVolumn}
              />
            ),
        )}
      </TableBody>
    </Table>
  );
};
const StyledTd = styled(Td)`
  padding: 0;
  text-align: center;
`;

const StyledTHead = styled(Thead)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.strokeSec};
  height: 50px;
`;
export default PoolsTableDesktop;
