import { Box, Flex, Grid } from 'components/Box';
import { Card } from 'components/Card';
import { RowBetween, RowFixed } from 'components/Layout/Row';
import Text from 'components/Text';
import { ROBO, USDC, WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FireBlueIcon } from 'svgs';
import { getNow } from 'utils/dateHelper';
import PoolFilter from 'views/Pools/components/PoolFilter';
import { useSelectedChainNetwork } from 'state/user/hooks';

import { EnumTrending, TreningCurreny } from '../types';
import TrendingTable from './TrendingTable';
import TrendingChart from './TrendingChart';

const TrendingList: React.FC<{ status: EnumTrending }> = ({ status }) => {
  const chainId = useSelectedChainNetwork();
  const data: TreningCurreny[] = useMemo(
    () => [
      {
        rank: 1,
        token: ROBO[chainId],
        discovered: getNow(),
      },
      {
        rank: 1,
        token: USDC[chainId],
        discovered: getNow(),
      },
      {
        rank: 1,
        token: WRAPPED_NATIVE_CURRENCY[chainId],
        discovered: getNow(),
      },
    ],
    [chainId],
  );
  const [currencySelected, setTokenSelected] = useState(data[0].token.address);
  const currency = useMemo(
    () => (data.find((tokenRank) => tokenRank.token.address === currencySelected) || data[0]).token,
    [currencySelected, data],
  );
  return (
    <WrapContainer p={['24px 0 0 !important', '', '', '', '', '24px 0 !important']}>
      <RowBetween
        px="24px"
        flexWrap="wrap"
        height="max-content"
        flexDirection={['column', 'column', 'row']}
        alignItems={['flex-start !important', '', '', '', '', 'center !important']}
        mb="16px"
        width="100%"
      >
        <RowFixed mr="24px">
          <StyledTitle mr="8px">{status}</StyledTitle> <FireBlueIcon size="24px" mt="4px" />
        </RowFixed>
        <Flex flex="1 1" width="100%" justifyContent="flex-end">
          <PoolFilter />
        </Flex>
      </RowBetween>
      <StyledWrapListAndChart>
        <TrendingTable trendingLists={data} onSelectCurrency={setTokenSelected} currencySelected={currencySelected} />
        <Box mt={['24px', '', '', '', '', '0']} pl={['0', '', '', '', '', '0']} pr={['0', '', '', '', '', '24px']}>
          <TrendingChart currency={currency} />
        </Box>
      </StyledWrapListAndChart>
    </WrapContainer>
  );
};

const WrapContainer = styled(Card)`
  width: 100%;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)), rgba(13, 14, 16, 0.9);
  box-shadow: 0px 4px 4px ${({ theme }) => theme.shadows.form};
  backdrop-filter: blur(40px);
`;

const StyledTitle = styled(Text)`
  font-weight: 600;
  white-space: nowrap;
  font-size: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    color: #77e9ff;
    font-size: 18px;
  }
`;

const StyledWrapListAndChart = styled(Grid)`
  grid-template-columns: 1fr;
  grid-gap: 12px;

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: 1fr 2fr;
    grid-gap: 24px;
  }
`;
export default TrendingList;
