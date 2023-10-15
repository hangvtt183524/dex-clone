import { Grid } from 'components/Box';
import Button from 'components/Button';
import ButtonBorderGradient from 'components/Button/ButtonBorderGradient';
import IconButtonStatus from 'components/Button/IconButtonStatus';
import { Card, CardProps } from 'components/Card';
import CopyToClipboard from 'components/CopyToClipboard';
import { AutoColumn, Column } from 'components/Layout/Column';
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row';
import Link from 'components/Link';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import Text from 'components/Text';
import { BIG_INT_ZERO } from 'config/constants/misc';
import { urlRoute } from 'config/endpoints';
import { CurrencyAmount, Token } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { usePoolDetail } from 'hooks/pool/usePoolDetail';
import JSBI from 'jsbi';
import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { Dots } from 'styles/common';
import { truncateHash } from 'utils/addressHelpers';
import currencyId from 'utils/currencyId';

const StyledPositionCard = styled(Card)`
  border: none;
  position: relative;
  overflow: hidden;
  width: 100%;
`;
const StyledWrapDetail = styled(AutoColumn).attrs({ gap: '16px' })`
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px;
  }

  border: 1px solid #444a56;
  border-radius: ${({ theme }) => theme.radius.small};
`;

const StyledTitleValue = styled(Text).attrs({
  color: 'textSubtle',
  fontWeight: 500,
})``;

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: CurrencyAmount<Token>; // optional balance to indicate that liquidity is deposited in mining pool
}

const V2PositionCard: React.FC<PositionCardProps & CardProps> = ({ pair, stakedBalance, ...props }) => {
  const {
    currency0,
    currency1,
    userPoolBalance,
    userDefaultPoolBalance,
    poolTokenPercentage,
    token0Deposited,
    token1Deposited,
  } = usePoolDetail({
    pair,
    stakedBalance,
  });

  return (
    <StyledPositionCard variant="panel" {...props}>
      <AutoColumn gap="20px" width="100%">
        <RowBetween>
          <AutoRow width="100%">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={34} />
            <Column>
              <StyledTitleValue mb="4px">
                {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}-${currency1.symbol}`}
              </StyledTitleValue>
              <Text mt='8px' fontWeight={500}>{userPoolBalance ? userPoolBalance.toFixed(10) : '-'}</Text>
            </Column>
          </AutoRow>

          <Column>
              <RowFixed ml="16px">
                  <Text small>{truncateHash(pair.liquidityToken.address, 4, 2)}</Text>
                  <IconButtonStatus
                      background="transparent"
                      p="0 !important"
                      width="32px !important"
                      height="32px !important"
                  >
                      <CopyToClipboard toCopy={pair.liquidityToken.address} />
                  </IconButtonStatus>
              </RowFixed>

              <Text ml="16px" fontSize={['10px', '', '', '', '', '12px']}>({pair?.liquidityToken?.symbol})</Text>
          </Column>
        </RowBetween>

        <StyledWrapDetail gap="8px">
          {stakedBalance && (
            <RowBetween>
              <StyledTitleValue>Pool tokens in rewards pool:</StyledTitleValue>
              <Text fontWeight={500}>{stakedBalance.toSignificant(4)}</Text>
            </RowBetween>
          )}
          <RowBetween>
            <RowFixed>
              <StyledTitleValue>Pooled {currency0.symbol}:</StyledTitleValue>
            </RowFixed>
            {token0Deposited ? (
              <RowFixed>
                <Text fontWeight={500} marginLeft="6px">
                  {token0Deposited?.toSignificant(6)}
                </Text>
                <CurrencyLogo size={20} style={{ marginLeft: '8px' }} currency={currency0} />
              </RowFixed>
            ) : (
              <Text>-</Text>
            )}
          </RowBetween>

          <RowBetween>
            <RowFixed>
              <StyledTitleValue>Pooled {currency1.symbol}:</StyledTitleValue>
            </RowFixed>
            {token1Deposited ? (
              <RowFixed>
                <Text fontWeight={500} marginLeft="6px">
                  {token1Deposited?.toSignificant(6)}
                </Text>
                <CurrencyLogo size={20} style={{ marginLeft: '8px' }} currency={currency1} />
              </RowFixed>
            ) : (
              <Text>-</Text>
            )}
          </RowBetween>

          <RowBetween>
            <StyledTitleValue>Your pool share:</StyledTitleValue>
            <Text fontWeight={500}>
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </RowBetween>
        </StyledWrapDetail>

        {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
          <Grid gridTemplateColumns="repeat(2,1fr)" gridGap="16px" width="100%">
            <Button
              variant="primary"
              as={Link}
              height="36px"
              href={
                urlRoute.addLiquidity({
                  inputCurrency: currencyId(currency0),
                  outputCurrency: currencyId(currency1),
                }).to
              }
              width="100% !important"
            >
              <Text fontWeight={600}>Add more</Text>
            </Button>

            <Link
              href={
                urlRoute.removeLiquidity({
                  inputCurrency: currencyId(currency0),
                  outputCurrency: currencyId(currency1),
                }).to
              }
              width="100% !important"
              height="36px"
            >
              <ButtonBorderGradient background="modal" width="100%" height="36px" p={['0 8px', '', '0 24px']}>
                <Text mx="auto" fontWeight={600}>
                  Remove
                </Text>
              </ButtonBorderGradient>
            </Link>
          </Grid>
        )}
      </AutoColumn>
    </StyledPositionCard>
  );
};

export default V2PositionCard;

export const MinimalPositionCard = ({ pair, showUnwrapped = false, ...props }: PositionCardProps & CardProps) => {
  const { currency0, currency1, userPoolBalance, poolTokenPercentage, token0Deposited, token1Deposited } =
    usePoolDetail({
      pair,
      showUnwrapped,
    });

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, JSBI.BigInt(0)) && (
        <Card width="100%" maxWidth="100%" {...props}>
          <AutoColumn gap="12px" padding='4px'>
            <AutoColumn>
              <RowFixed>
                <Text fontWeight={500} fontSize="16px">
                  <Trans>Your position</Trans>
                </Text>
              </RowFixed>
            </AutoColumn>
            <RowBetween mb="8px">
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={28} />
                <Text fontWeight={500} scale="lg">
                  {currency0.symbol}-{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} scale="lg">
                  {userPoolBalance ? userPoolBalance.toFixed(10) : '-'}
                </Text>
              </RowFixed>
            </RowBetween>
            <AutoColumn gap="12px">
              <RowBetween>
                <StyledTitleValue>
                  <Trans>Your pool share:</Trans>
                </StyledTitleValue>
                <Text scale="sm" fontWeight={500}>
                  {poolTokenPercentage ? `${poolTokenPercentage.toFixed(2)}%` : '-'}
                </Text>
              </RowBetween>
              <RowBetween>
                <StyledTitleValue>Pooled {currency0.symbol}:</StyledTitleValue>
                {token0Deposited ? (
                  <RowFixed>
                    <Text scale="sm" fontWeight={500} marginLeft="6px">
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  <Text>-</Text>
                )}
              </RowBetween>
              <RowBetween>
                <StyledTitleValue>Pooled {currency1.symbol}:</StyledTitleValue>
                {token1Deposited ? (
                  <RowFixed>
                    <Text scale="sm" fontWeight={500} marginLeft="6px">
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  <Text>-</Text>
                )}
              </RowBetween>
            </AutoColumn>
          </AutoColumn>
        </Card>
      )}
    </>
  );
};
