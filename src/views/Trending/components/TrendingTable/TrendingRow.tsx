import { Tr } from 'components/Table/Cell';

import { RowMiddle } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import Text from 'components/Text';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { TreningCurreny } from 'views/Trending/types';
import { StyledTd } from './styled';

const TrendingRow: React.FunctionComponent<
  React.PropsWithChildren<
    TreningCurreny & {
      selected: boolean;
      onSelectCurrency: (address: string) => void;
    }
  >
> = ({ discovered, token, rank, selected, onSelectCurrency }) => {
  return (
    <StyledRow $selected={selected} onClick={() => onSelectCurrency(token.address)}>
      <StyledRowTd>
        <Text width="100%" textAlign="center" color="textSubtle">
          {rank}
        </Text>
      </StyledRowTd>

      <StyledRowTd>
        <RowMiddle>
          <CurrencyLogo currency={token} size={28} />
          <Text ml="12px">{token.name}</Text>
        </RowMiddle>
      </StyledRowTd>

      <StyledRowTd>
        <Text textAlign="right" fontWeight={400} color={selected ? '#F7FAFC' : 'textAlt4'}>
          {moment(discovered).format('YYYY/MM/DD')}
        </Text>
      </StyledRowTd>
    </StyledRow>
  );
};

const StyledRowTd = styled(StyledTd)`
  padding: 12px;
  position: relative;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 18px 12px;
  }
`;
const StyledRow = styled(Tr)<{ $selected: boolean }>`
  cursor: pointer;
  position: relative;

  &:after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    border-color: rgba(255, 255, 255, 0.15);
    background: ${({ $selected }) =>
      $selected ? 'linear-gradient(90.55deg, rgba(8, 98, 153, 0.76) 0.48%, #121415 92.31%)' : ''};
    border-bottom: 1px solid ${({ theme }) => theme.colors.stroke};
  }
`;

export default TrendingRow;
