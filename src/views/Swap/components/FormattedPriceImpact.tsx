import Text from 'components/Text';
import { Percent } from 'config/sdk-core';
import React from 'react';

export const formatPriceImpact = (priceImpact: Percent) => `${priceImpact.multiply(-1).toFixed(2)}%`;

/**
 * Formatted version of price impact text with warning colors
 */
const FormattedPriceImpact = ({ priceImpact }: { priceImpact?: Percent }) => {
  return (
    <Text
      color={priceImpact && Number(priceImpact.multiply(-1).toFixed(2)) < 0 ? 'failure' : 'textSubtle'}
      fontWeight={500}
      fontSize="14px"
    >
      {priceImpact ? formatPriceImpact(priceImpact) : '-'}
    </Text>
  );
};

export default FormattedPriceImpact;
