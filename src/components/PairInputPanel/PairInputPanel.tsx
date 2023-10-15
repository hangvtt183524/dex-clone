import React from 'react';
import Flex from 'components/Box/Flex';
import Text from 'components/Text';
import styled from 'styled-components';
import Skeleton from 'components/Skeleton';
import IconButton from 'components/Button/IconButton';
import { parseNumberDisplay, getFullDecimals } from 'utils/numbersHelper';
import { RowBetween, RowFixed, RowMiddle } from 'components/Layout/Row';
import NumericalInput from 'components/Input/NumericalInput';
import { Card } from 'components/Card';
import ButtonGroup from 'components/ButtonGroup/ButtonGroup';
import ButtonItemGroup from 'components/ButtonGroup/ButtonItemGroup';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import { useAccount } from 'packages/wagmi/src';
import { SelectInputTokenProps } from './types';

const percents = [25, 50, 75, 100];
const PairInputPanel: React.FC<SelectInputTokenProps> = (props) => {
  const { handleUserInput, handleMax, value, balance, pair } = props;
  const { isConnected } = useAccount();

  const lpToken = pair?.liquidityToken;
  const currencyA = pair?.token0;
  const currencyB = pair?.token1;

  const percentInputWithBalance = balance
    ? Math.round(getFullDecimals(value, lpToken?.decimals).dividedBy(balance).multipliedBy(100).toNumber())
    : 0;

  return (
    pair && (
      <Wrapper scale="sm" {...props}>
        <RowBetween mb={lpToken && isConnected ? '6px' : 'unset'}>
          <RowFixed my="12px">
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={28} />
            <Text>
              {currencyA?.symbol}-{currencyB?.symbol}
            </Text>
          </RowFixed>
          {lpToken && isConnected ? (
            <IconButton alignItems="flex-start" onClick={() => handleMax('100')} height="20px">
              <RowMiddle>
                <Text fontSize="12px" color="textSubtle" mr="4px">
                  Balances
                </Text>
                {balance?.gte(0) ? (
                  <Text fontWeight={500} fontSize="12px">
                    {parseNumberDisplay(balance, 10, lpToken.decimals)}
                  </Text>
                ) : (
                  <Skeleton width="24px" height="18px" />
                )}
              </RowMiddle>
            </IconButton>
          ) : (
            <></>
          )}
        </RowBetween>

        <Flex mt="4px" mb="8px" maxHeight={56} className="select-input-token">
          <NumericalInput
            className="token-amount-input"
            value={value}
            onUserInput={(val) => {
              handleUserInput(val);
            }}
            variant="transparent"
          />
        </Flex>
        <ButtonGroup>
          {percents.map((percent) => (
            <ButtonItemGroup
              height="28px"
              key={percent}
              active={percentInputWithBalance === percent}
              onClick={() => handleMax(percent.toString())}
            >
              {percent}%
            </ButtonItemGroup>
          ))}
        </ButtonGroup>
      </Wrapper>
    )
  );
};

const Wrapper = styled(Card)`
  background: ${({ theme }) => theme.colors.inputSecondary};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: 2px 10px 8px;

  .token-amount-input {
    font-size: 20px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 4px 20px 16px;

    .token-amount-input {
      font-size: 28px;
    }
  }
`;

export default PairInputPanel;
