import Text from 'components/Text';
import { Currency, Price } from 'config/sdk-core';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { formatTransactionAmount, priceToPreciseFloat } from 'utils/numbersHelper';

interface TradePriceProps {
  price: Price<Currency, Currency>;
  showInverted?: boolean;
}

const StyledPriceContainer = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  grid-template-columns: 1fr auto;
  grid-gap: 0.25rem;
  display: flex;
  flex-direction: row;
  text-align: left;
  flex-wrap: wrap;
  user-select: text;
`;

const TradePrice = ({ price, showInverted: showInvertedProps = false }: TradePriceProps) => {
  const [showInverted, setShowInverted] = useState(showInvertedProps);

  // const usdcPrice = useStablecoinPrice(showInverted ? price.baseCurrency : price.quoteCurrency);

  let formattedPrice: string;
  try {
    formattedPrice = showInverted
      ? formatTransactionAmount(priceToPreciseFloat(price))
      : formatTransactionAmount(priceToPreciseFloat(price.invert()));
  } catch (error) {
    formattedPrice = '0';
  }

  const label = showInverted ? `${price.quoteCurrency?.symbol}` : `${price.baseCurrency?.symbol} `;
  const labelInverted = showInverted ? `${price.baseCurrency?.symbol} ` : `${price.quoteCurrency?.symbol}`;
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted]);

  const text = `${`1 ${labelInverted} = ${formattedPrice}` ?? '-'} ${label}`;
  return (
    <StyledPriceContainer
      onClick={(e) => {
        e.stopPropagation(); // dont want this click to affect dropdowns / hovers
        flipPrice();
      }}
      title={text}
    >
      <Text fontWeight={500} color="text">
        {text}
      </Text>{' '}
      {/* {usdcPrice && <Trans>({formatDollar({ num: priceToPreciseFloat(usdcPrice) })})</Trans>} */}
    </StyledPriceContainer>
  );
};
export default TradePrice;
