import BigNumber from 'bignumber.js';
import { CardProps } from 'components/Card';
import { Currency } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { HTMLAttributes } from 'react';

export interface SelectInputTokenProps extends HTMLAttributes<HTMLDivElement>, CardProps {
  pair: Pair;
  error?: string;
  selectedToken?: Currency;
  otherSelectedToken?: Currency;
  amount?: string;
  balance?: BigNumber;
  value: string;
  handleUserInput?: (val: string) => void;
  handleMax?: (val?: string) => void;
}
