import { ISTAKING_REWARD } from 'config/abis';
import { SupportedChainId, CurrencyAmount, Token } from 'config/sdk-core';
import { DAI, ROBO, USDC, USDT, WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import tryParseAmount from 'utils/tryParseAmount';
import { Pair } from 'config/v2-sdk';
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp';
import JSBI from 'jsbi';
import { Trans } from 'react-i18next';
import React, { useMemo, ReactNode } from 'react';
import { NEVER_RELOAD, useMultipleContractSingleData } from 'state/multicall/hooks';
import { useAccount } from 'packages/wagmi/src';
import { useSelectedChainNetwork } from '../user/hooks';

export const STAKING_GENESIS = 1600387200;

export const REWARDS_DURATION_DAYS = 60;

export const STAKING_REWARDS_INFO: {
  [chainId: number]: {
    tokens: [Token, Token];
    stakingRewardAddress: string;
  }[];
} = {
  [SupportedChainId.MAINNET]: [
    {
      tokens: [WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET] as Token, DAI[SupportedChainId.MAINNET]],
      stakingRewardAddress: '0xa1484C3aa22a66C62b77E0AE78E15258bd0cB711',
    },
    {
      tokens: [WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET] as Token, USDC[SupportedChainId.MAINNET]],
      stakingRewardAddress: '0x7FBa4B8Dc5E7616e59622806932DBea72537A56b',
    },
    {
      tokens: [WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET] as Token, USDT[SupportedChainId.MAINNET]],
      stakingRewardAddress: '0x6C3e4cb2E96B01F4b866965A91ed4437839A121a',
    },
    // {
    //   tokens: [WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET] as Token, WBTC],
    //   stakingRewardAddress: "0xCA35e32e7926b96A9988f61d510E038108d8068e"
    // }
  ],
};

export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string;
  // the tokens involved in this pair
  tokens: [Token, Token];
  // the amount of token currently staked, or undefined if no account
  stakedAmount: CurrencyAmount<Token>;
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: CurrencyAmount<Token>;
  // the total amount of token staked in the contract
  totalStakedAmount: CurrencyAmount<Token>;
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: CurrencyAmount<Token>;
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: CurrencyAmount<Token>;
  // when the period ends
  periodFinish: Date | undefined;
  // if pool is active
  active: boolean;
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: CurrencyAmount<Token>,
    totalStakedAmount: CurrencyAmount<Token>,
    totalRewardRate: CurrencyAmount<Token>,
  ) => CurrencyAmount<Token>;
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
  const chainId = useSelectedChainNetwork();
  const { address } = useAccount();

  // detect if staking is ended
  const currentBlockTimestamp = useCurrentBlockTimestamp();

  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter((stakingRewardInfo) =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1]),
          ) ?? []
        : [],
    [chainId, pairToFilterBy],
  );

  const robo = chainId ? ROBO[chainId] : undefined;

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info]);

  const accountArg = useMemo(() => [address ?? undefined], [address]);

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, ISTAKING_REWARD, 'balanceOf', accountArg);
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, ISTAKING_REWARD, 'earned', accountArg);
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, ISTAKING_REWARD, 'totalSupply');

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(rewardsAddresses, ISTAKING_REWARD, 'rewardRate', [], NEVER_RELOAD);
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    ISTAKING_REWARD,
    'periodFinish',
    [],
    NEVER_RELOAD,
  );

  return useMemo(() => {
    if (!chainId || !robo) return [];

    return rewardsAddresses.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index];
      const earnedAmountState = earnedAmounts[index];

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index];
      const rewardRateState = rewardRates[index];
      const periodFinishState = periodFinishes[index];

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error
        ) {
          console.error('Failed to load staking rewards info');
          return memo;
        }

        // get the LP token
        const { tokens } = info[index];
        const dummyPair = new Pair(
          CurrencyAmount.fromRawAmount(tokens[0], '0'),
          CurrencyAmount.fromRawAmount(tokens[1], '0'),
        );

        // check for account, if no account set to 0

        const stakedAmount = CurrencyAmount.fromRawAmount(
          dummyPair.liquidityToken,
          JSBI.BigInt(balanceState?.result?.[0] ?? 0),
        );
        const totalStakedAmount = CurrencyAmount.fromRawAmount(
          dummyPair.liquidityToken,
          JSBI.BigInt(totalSupplyState.result?.[0]),
        );
        const totalRewardRate = CurrencyAmount.fromRawAmount(robo, JSBI.BigInt(rewardRateState.result?.[0]));

        const getHypotheticalRewardRate = (
          stakedAmount: CurrencyAmount<Token>,
          totalStakedAmount: CurrencyAmount<Token>,
          totalRewardRate: CurrencyAmount<Token>,
        ): CurrencyAmount<Token> => {
          return CurrencyAmount.fromRawAmount(
            robo,
            JSBI.greaterThan(totalStakedAmount.quotient, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.quotient, stakedAmount.quotient), totalStakedAmount.quotient)
              : JSBI.BigInt(0),
          );
        };

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate);

        const periodFinishSeconds = periodFinishState.result?.[0]?.toNumber();
        const periodFinishMs = periodFinishSeconds * 1000;

        // compare period end timestamp vs current block timestamp (in seconds)
        const active =
          periodFinishSeconds && currentBlockTimestamp ? periodFinishSeconds > currentBlockTimestamp.toNumber() : true;

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: CurrencyAmount.fromRawAmount(robo, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          totalRewardRate,
          stakedAmount,
          totalStakedAmount,
          getHypotheticalRewardRate,
          active,
        });
      }
      return memo;
    }, []);
  }, [
    balances,
    chainId,
    currentBlockTimestamp,
    earnedAmounts,
    info,
    periodFinishes,
    rewardRates,
    rewardsAddresses,
    totalSupplies,
    robo,
  ]);
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token | undefined,
  userLiquidityUnstaked: CurrencyAmount<Token> | undefined,
): {
  parsedAmount?: CurrencyAmount<Token>;
  error?: ReactNode;
} {
  const { address } = useAccount();

  const parsedInput: CurrencyAmount<Token> | undefined = tryParseAmount(typedValue, stakingToken);

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.quotient, userLiquidityUnstaked.quotient)
      ? parsedInput
      : undefined;

  let error: ReactNode | undefined;
  if (!address) {
    error = <Trans>Connect Wallet</Trans>;
  }
  if (!parsedAmount) {
    error = error ?? <Trans>Enter an amount</Trans>;
  }

  return {
    parsedAmount,
    error,
  };
}
