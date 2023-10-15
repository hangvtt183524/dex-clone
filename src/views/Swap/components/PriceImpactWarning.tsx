/* eslint-disable max-len */
import { RowBetween } from 'components/Layout/Row';
import { Message, MessageText } from 'components/Message';
import { Percent } from 'config/sdk-core';
import useTooltip from 'hooks/useTooltip';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { formatPriceImpact } from './FormattedPriceImpact';

interface PriceImpactWarningProps {
  priceImpact: Percent;
}

const PriceImpactWarning = ({ priceImpact }: PriceImpactWarningProps) => {
  const { t } = useTranslation();

  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    t(
      'A swap of this size may have a high price impact, given the current liquidity in the pool. There may be a large difference between the amount of your input token and what you will receive in the output token',
    ),
    {
      trigger: 'hover',
    },
  );

  return (
    <Message variant="failure" my="16px">
      <RowBetween ref={targetRef} width="100%">
        <MessageText width="100%" mr="8px">
          <Trans>Price impact warning</Trans>
        </MessageText>
        <MessageText>{formatPriceImpact(priceImpact)}</MessageText>
        {tooltipVisible && tooltip}
      </RowBetween>
    </Message>
  );
};
export default PriceImpactWarning;
