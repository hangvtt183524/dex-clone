import Text from 'components/Text';
import { Currency, CurrencyAmount, Percent } from 'config/sdk-core';
import useTooltip from 'hooks/useTooltip';
import { Trans, useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { warningSeverity } from '../../utils/prices';

export const FiatValue = ({
  fiatValue,
  priceImpact,
}: {
  fiatValue: CurrencyAmount<Currency> | null | undefined;
  priceImpact?: Percent;
}) => {
  const { t } = useTranslation();
  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    t`The estimated difference between the USD values of input and output amounts.`,
    {
      trigger: 'hover',
    },
  );
  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan('0')) return 'success';
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return 'warning';
    if (severity < 3) return 'warning';
    return 'error';
  }, [priceImpact]);

  const p = Number(fiatValue?.toFixed());
  const visibleDecimalPlaces = p < 1.05 ? 4 : 2;

  return (
    <Text
      fontSize="14px"
      color="textSubtle"
      style={{
        wordBreak: 'break-all',
      }}
    >
      {fiatValue && <>${fiatValue?.toFixed(visibleDecimalPlaces, { groupSeparator: ',' })}</>}
      {priceImpact ? (
        <span style={{ color: priceImpactColor, marginLeft: '4px', opacity: 0.6 }} ref={targetRef}>
          <Trans>({priceImpact.multiply(-1).toSignificant(2)}%)</Trans>
          {tooltipVisible && tooltip}
        </span>
      ) : null}
    </Text>
  );
};
