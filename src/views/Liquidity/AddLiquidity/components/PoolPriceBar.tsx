import IconButton from 'components/Button/IconButton';
import Text from 'components/Text';
import { Currency, Price, Token } from 'config/sdk-core';
import React, { useCallback, useState } from 'react';
import { formatTransactionAmount, priceToPreciseFloat } from 'utils/numbersHelper';
import { unwrappedToken } from 'utils/wrappedCurrency';

export const PoolPriceBar = ({ price }: { price?: Price<Currency, Currency> }) => {
  const [showInverted, setShowInverted] = useState(false);

  let formattedPrice: string;
  try {
    formattedPrice = showInverted
      ? formatTransactionAmount(priceToPreciseFloat(price))
      : formatTransactionAmount(priceToPreciseFloat(price.invert()));
  } catch (error) {
    formattedPrice = '0';
  }

  const symbolIn = unwrappedToken(price?.baseCurrency as Token)?.symbol || '';
  const symbolOut = unwrappedToken(price?.quoteCurrency as Token)?.symbol || '';

  const label = showInverted ? `${symbolOut}` : `${symbolIn} `;
  const labelInverted = showInverted ? `${symbolIn} ` : `${symbolOut}`;

  const flipPrice = useCallback(() => setShowInverted(!showInverted), [setShowInverted, showInverted]);

  const text = `${`1 ${labelInverted} = ${formattedPrice}` ?? '-'} ${label}`;

  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation(); // dont want this click to affect dropdowns / hovers
        flipPrice();
      }}
      title={text}
    >
      <Text fontWeight={500}>{text}</Text>
    </IconButton>
  );
};
