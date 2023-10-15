import { AutoColumn } from 'components/Layout/Column';
import { RowBetween, RowMiddle } from 'components/Layout/Row';
import QuestionHelper from 'components/QuestionHelper';
import Text from 'components/Text';
import { explainField } from 'config/explain';
import { Currency, CurrencyAmount, Percent, Price } from 'config/sdk-core';
import React from 'react';
import styled from 'styled-components';
import { FieldMint } from 'state/mint/actions';
import { ONE_BIPS } from 'config/constants/misc';
import { usePoolDetail } from 'hooks/pool/usePoolDetail';
import { Pair } from 'config/v2-sdk';
import { JSBI_ZERO } from 'config/constants/number';
import { Box } from 'components/Box';
import { PoolPriceBar } from './PoolPriceBar';

const AdvancedPoolDetails: React.FC<{
  price: Price<Currency, Currency>;
  pair: Pair;
  currencies: { [field in FieldMint]?: Currency };
  allowedSlippage: Percent;
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  tokenIn: CurrencyAmount<Currency>;
  tokenOut: CurrencyAmount<Currency>;
  liquidityMinted: CurrencyAmount<Currency>;
}> = ({ price, pair, noLiquidity, poolTokenPercentage, liquidityMinted, tokenIn, tokenOut }) => {
  const {
    currency0,
    currency1,
    token0Deposited = null,
    token1Deposited = null,
  } = usePoolDetail({
    pair,
  });

  const tokenDepositedA = noLiquidity || !pair ? tokenIn : token0Deposited;
  const tokenDepositedB = noLiquidity || !pair ? tokenOut : token1Deposited;

  return (
    <AutoColumn gap="12px">
      {token0Deposited?.greaterThan(JSBI_ZERO) && tokenDepositedA?.greaterThan(0) && (
        <StyledItemInfo>
          <StyledTitle>Pooled {currency0.symbol}:</StyledTitle>
          <StyledValue>{tokenDepositedA?.toSignificant(6)}</StyledValue>
        </StyledItemInfo>
      )}

      {token1Deposited?.greaterThan(JSBI_ZERO) && tokenDepositedB?.greaterThan(0) && (
        <>
          <StyledItemInfo>
            <StyledTitle>Pooled {currency1.symbol}:</StyledTitle>
            <StyledValue>{tokenDepositedB?.toSignificant(6)}</StyledValue>
          </StyledItemInfo>
          <StyledStroke />
        </>
      )}

      <StyledItemInfo>
        <StyledTitle>Price</StyledTitle>
        <PoolPriceBar price={price} />
      </StyledItemInfo>

      <StyledItemInfo>
        <RowMiddle>
          <StyledTitle mr="8px">Your Pool Share</StyledTitle>
        </RowMiddle>
        <StyledValue>
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </StyledValue>
      </StyledItemInfo>
      <StyledItemInfo>
        <RowMiddle>
          <StyledTitle mr="8px">LP Tokens Received</StyledTitle>
        </RowMiddle>
        <StyledValue>{liquidityMinted ? liquidityMinted.toSignificant(6) : '-'}</StyledValue>
      </StyledItemInfo>
    </AutoColumn>
  );
};

const StyledItemInfo = styled(RowBetween)``;

const StyledTitle = styled(Text).attrs({
  scale: 'sm',
  color: 'textSubtle',
  fontWeight: 400,
})``;
const StyledValue = styled(Text).attrs({
  scale: 'sm',
  color: 'text',
  fontWeight: 500,
})`
  white-space: nowrap;
`;

const StyledStroke = styled(Box)`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.colors.strokeSec};
`;

export default AdvancedPoolDetails;
