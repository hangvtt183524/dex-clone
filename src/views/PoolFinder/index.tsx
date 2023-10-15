import { Currency, CurrencyAmount, Token } from 'config/sdk-core';
import { AutoColumn, ColumnCenter } from 'components/Layout/Column';
import { Row, RowCenter } from 'components/Layout/Row';
import { MinimalPositionCard } from 'components/PositionCard';
import { useV2Pair, PairState } from 'hooks/pool/useV2Pairs';
import { useTokenBalance } from 'hooks/useBalances';
import JSBI from 'jsbi';
import React, { useState, useEffect, useCallback } from 'react';
import { Trans } from 'react-i18next';
import { usePairAdder } from 'state/user/hooks';
import { Dots } from 'styles/common';
import { Card } from 'components/Card';
import { Native } from 'config/native';
import Text from 'components/Text';
import { PlusIcon } from 'svgs';
import Link from 'components/Link';
import { urlRoute } from 'config/endpoints';
import styled, { css } from 'styled-components';
import CurrencySelectFull from 'components/CurrencySelect/CurrencySelectFull';
import RoboTheme from 'styles';
import CardBorderGradient from 'components/Card/CardBorderGradient';
import { useAccount } from 'packages/wagmi/src';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import PoolFinderHeader from './PoolFinderHeader';

const StyledCard = styled(Card)<{ $small?: boolean }>`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.strokeSec};
  background: transparent;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ $small }) =>
    $small &&
    css`
      display: block;
      background: transparent;
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      min-height: 70px;
    `}

  font-feature-settings: 'pnum' on, 'lnum' on;

  color: #ffffff;
`;

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const PoolFinder: React.FC = () => {
  const { chainId } = useActiveWeb3React();
  const { address } = useAccount();
  const [currency0, setCurrency0] = useState<Currency | null>(() => (chainId ? Native.onChain(chainId) : null));
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined);
  const addPair = usePairAdder();

  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.quotient, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.quotient, JSBI.BigInt(0)),
    );

  const position: CurrencyAmount<Token> | undefined = useTokenBalance(address ?? undefined, pair?.liquidityToken);
  const hasPosition = Boolean(position && JSBI.greaterThan(position.quotient, JSBI.BigInt(0)));

  const handleCurrencySelect = useCallback((currency: Currency, field: Fields) => {
    if (field === Fields.TOKEN0) {
      setCurrency0(currency);
    } else {
      setCurrency1(currency);
    }
  }, []);

  const prerequisiteMessage = (
    <CardBorderGradient minHeight="100px" style={{}}>
      <RowCenter height="100%">
        <Text textAlign="center">
          {!address ? (
            <Trans>Connect to a wallet to find pools</Trans>
          ) : (
            <Trans>Select a token to find your v2 liquidity.</Trans>
          )}
        </Text>
      </RowCenter>
    </CardBorderGradient>
  );

  return (
    <Card boxShadow="form" maxWidth="500px" mx="auto">
      <PoolFinderHeader />
      <AutoColumn gap="16px">
        <StyledCard $small>
          <Trans>
            <strong style={{ color: '#FFF' }}>Tip:</strong> Use this tool to find v2 pools that don&apos;t automatically
            appear in the interface.
          </Trans>
        </StyledCard>

        <Row>
          <CurrencySelectFull
            selectedToken={currency0}
            otherSelectedToken={currency1}
            handleCurrencySelect={(currency) => {
              handleCurrencySelect(currency, Fields.TOKEN0);
            }}
            showCommonBases
          />
        </Row>

        <ColumnCenter>
          <PlusIcon color="#FFF" />
        </ColumnCenter>

        <CurrencySelectFull
          selectedToken={currency1}
          otherSelectedToken={currency0}
          handleCurrencySelect={(currency) => {
            handleCurrencySelect(currency, Fields.TOKEN1);
          }}
          showCommonBases
        />

        {hasPosition && (
          <ColumnCenter
            style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
          >
            <Text textAlign="center" fontWeight={500}>
              <Trans>Pool Found!</Trans>
            </Text>
            <Link href={urlRoute.pools().to} mt="8px">
              <Text textAlign="center" gradient={RoboTheme.colors.gradients.primary}>
                <Trans>Manage this pool.</Trans>
              </Text>
            </Link>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <StyledCard>
                <MinimalPositionCard pair={pair} style={{ background: 'transparent', padding: 0 }} />
              </StyledCard>
            ) : (
              <StyledCard>
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">
                    <Trans>You don’t have liquidity in this pool yet.</Trans>
                  </Text>
                  <Link
                    href={
                      urlRoute.addLiquidity({ inputCurrency: currency0.symbol, outputCurrency: currency1.symbol }).to
                    }
                  >
                    <Text textAlign="center" color="loading">
                      <Trans>Add liquidity.</Trans>
                    </Text>
                  </Link>
                </AutoColumn>
              </StyledCard>
            )
          ) : validPairNoLiquidity ? (
            <StyledCard>
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  <Trans>No pool found.</Trans>
                </Text>
                <Link
                  href={urlRoute.addLiquidity({ inputCurrency: currency0.symbol, outputCurrency: currency1.symbol }).to}
                >
                  <Trans>Create pool.</Trans>
                </Link>
              </AutoColumn>
            </StyledCard>
          ) : pairState === PairState.INVALID ? (
            <StyledCard>
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center" fontWeight={500}>
                  <Trans>Invalid pair.</Trans>
                </Text>
              </AutoColumn>
            </StyledCard>
          ) : pairState === PairState.LOADING ? (
            <StyledCard>
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  <Trans>Loading</Trans>
                  <Dots />
                </Text>
              </AutoColumn>
            </StyledCard>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>
    </Card>
  );
};

export default PoolFinder;
