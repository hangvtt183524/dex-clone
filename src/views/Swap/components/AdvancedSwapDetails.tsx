import { AutoColumn } from 'components/Layout/Column';
import { RowBetween, RowMiddle } from 'components/Layout/Row';
import QuestionHelper from 'components/QuestionHelper';
import Text from 'components/Text';
import { explainField } from 'config/explain';
import { TradeType } from 'config/pair';
import { Currency, Percent } from 'config/sdk-core';
import { Trans } from 'react-i18next';
import React, { useMemo } from 'react';
import { InterfaceTrade } from 'state/routing/types';
import { useUserSlippageTolerance } from 'state/user/hooks';
import styled from 'styled-components';
import { formatDisplaySlipageNumber } from 'utils/numbersHelper';
import { computeRealizedPriceImpact } from 'utils/prices';
import { displaySignificantSymbol } from 'utils/tokenHelpers';
import FormattedPriceImpact from './FormattedPriceImpact';
import TradePrice from './TradePrice';

const AdvancedSwapDetails: React.FC<{
  trade: InterfaceTrade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
}> = ({ trade, allowedSlippage }) => {
  const {
    //  expectedOutputAmount,
    priceImpact,
  } = useMemo(() => {
    return {
      expectedOutputAmount: trade?.outputAmount,
      priceImpact: trade ? computeRealizedPriceImpact(trade) : undefined,
    };
  }, [trade]);

  const [slippage] = useUserSlippageTolerance();

  return (
    <AutoColumn gap="12px">
      <StyledItemInfo>
        <StyledTitle>Price</StyledTitle>
        {trade ? <TradePrice price={trade?.executionPrice} /> : <StyledValue>-</StyledValue>}
      </StyledItemInfo>
      <StyledItemInfo>
        <StyledTitle>Slippage Tolerance</StyledTitle>
        <Text fontWeight={500} scale="sm" color="mark">
          {formatDisplaySlipageNumber(slippage)}%
        </Text>
      </StyledItemInfo>

      <StyledItemInfo>
        <RowMiddle>
          <StyledTitle mr="8px">Price Impact</StyledTitle>
          <QuestionHelper text={explainField.priceImpact} placement='auto' />
        </RowMiddle>
        <StyledValue>
          <FormattedPriceImpact priceImpact={priceImpact} />
        </StyledValue>
      </StyledItemInfo>

      <StyledItemInfo>
        <RowMiddle>
          <StyledTitle mr="8px">
              <Trans>Minimum received</Trans>
          </StyledTitle>
          <QuestionHelper text={explainField.minimumReceived} placement='auto' />
        </RowMiddle>

        <StyledValue style={{ whiteSpace: 'nowrap' }}>
          {trade
            ? trade.tradeType === TradeType.EXACT_INPUT
              ? `${displaySignificantSymbol(trade.minimumAmountOut(allowedSlippage), 6)}`
              : `${displaySignificantSymbol(trade.maximumAmountIn(allowedSlippage), 6)}`
            : '-'}
        </StyledValue>
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

export default AdvancedSwapDetails;
