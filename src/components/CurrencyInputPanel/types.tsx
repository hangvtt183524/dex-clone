import BigNumber from 'bignumber.js';
import { CardProps } from 'components/Card';
import { Currency, CurrencyAmount, Percent } from 'config/sdk-core';
import { HTMLAttributes } from 'react';

export interface SelectInputTokenProps extends HTMLAttributes<HTMLDivElement>, CardProps {
  borderBackground?: string;
  background?: string;
  disabled?: boolean;
  error?: string;
  selectedToken?: Currency;
  otherSelectedToken?: Currency;
  commonBasesType?: string;
  disabledPercent?: boolean;
  amount?: string;
  hideBalance?: boolean;
  showMaxButton?: boolean;
  fiatValue?: CurrencyAmount<Currency> | null;
  priceImpact?: Percent;

  balance?: BigNumber;
  value: string;
  handleCurrencySelect?: (currency: Currency) => void;
  handleUserInput?: (val: string) => void;
  handleMax?: (val?: string) => void;
}
