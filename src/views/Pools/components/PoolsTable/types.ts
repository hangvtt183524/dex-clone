import { CurrencyAmount, Token } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { BoxProps } from 'components/Box';
import { StakingInfo } from 'state/stake/hooks';

export interface PoolTableProps extends BoxProps {
  pairs: Pair[];
  stakingInfosWithBalance: StakingInfo[];
}

export interface PositionCardProps extends BoxProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: CurrencyAmount<Token>; // optional balance to indicate that liquidity is deposited in mining pool
}
