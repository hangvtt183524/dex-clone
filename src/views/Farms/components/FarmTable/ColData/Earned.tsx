import { RowFixed } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import Skeleton from 'components/Skeleton';
import Text from 'components/Text';
import React from 'react';
import styled from 'styled-components';
import { parseNumberDisplay } from 'utils/numbersHelper';
import BigNumber from 'bignumber.js';
import { EarnedProps } from '../../types';

interface EarnedPropsWithLoading extends EarnedProps {
  userDataReady: boolean;
}
const Amount = styled(Text)<{ earned: number }>`
  color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`;

const Earned: React.FunctionComponent<React.PropsWithChildren<EarnedPropsWithLoading>> = ({
  earnings,
  userDataReady,
  token,
}) => {
  if (!token) {
      return (
          <RowFixed>
              <Amount fontSize={['12px', '', '', '', '', '14px']} ml="6px" earned={earnings}>
                  -
              </Amount>
          </RowFixed>
      );
  }

  if (userDataReady) {
    return (
      <RowFixed>
        <CurrencyLogo currency={token} size={28} />
        <Amount fontSize={['12px', '', '', '', '', '14px']} ml="6px" earned={earnings}>
          {parseNumberDisplay(new BigNumber(earnings), 5, token.decimals)} {token.symbol}
        </Amount>
      </RowFixed>
    );
  }
  if (!userDataReady && new BigNumber(earnings).eq(0)) {
    return (
      <RowFixed>
        <CurrencyLogo currency={token} size={28} />
        <Amount fontSize={['12px', '', '', '', '', '14px']} ml="6px" earned={earnings}>
          0 {token?.symbol}
        </Amount>
      </RowFixed>
    );
  }

  return (
    <Amount earned={0}>
      <Skeleton mr="8px" width={28} />
      <Skeleton width={40} />
    </Amount>
  );
};
export default Earned;
