import BigNumber from 'bignumber.js';
import { Token } from 'config/sdk-core';
import { SerializedBigNumber } from '.';
import { SerializedToken } from './token';

export interface PoolDeployedBlockNumber {
  [key: string]: number;
}

interface PoolConfigBaseProps {
  sousId: number;
  sortOrder?: number;
  harvest?: boolean;
  isFinished?: boolean;
  enableEmergencyWithdraw?: boolean;
  deployedBlockNumber?: number;
}

export interface SerializedPoolConfig extends PoolConfigBaseProps {
  earningToken: SerializedToken;
}

export interface DeserializedPoolConfig extends PoolConfigBaseProps {
  earningToken: Token;
}

export interface SerializedPoolInfo {
  rewardPerSec: string;
  gRoboStakedAmount: string;
  endTime: number;
}

export interface SerializedPool extends SerializedPoolConfig {
  totalStaked?: SerializedBigNumber;
  rewardTokenPrice?: SerializedBigNumber;
  apr?: number;

  userData?: {
    stakedBalance: SerializedBigNumber;
    pendingReward: SerializedBigNumber;
  };
}

export interface DeserializedPool extends DeserializedPoolConfig {
  totalStaked?: BigNumber;
  rewardTokenPrice?: BigNumber;
  apr?: number;
  userData?: {
    stakedBalance: BigNumber;
    pendingReward: BigNumber;
  };
}

export interface DeserializedPoolUserData {
  allowance: BigNumber;
  stakingTokenBalance: BigNumber;
}
