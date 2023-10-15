import { isAddress } from '@ethersproject/address/lib';
import { Box } from 'components/Box';
import { Card } from 'components/Card';
import { FiatValue } from 'components/CurrencyInputPanel/FiatValue';
import { AutoColumn } from 'components/Layout/Column';
import { RowBetween, RowCenter, RowFixed } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import Text from 'components/Text';
import { Currency, CurrencyAmount, Percent, TradeType } from 'config/sdk-core';
import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { InterfaceTrade } from 'state/routing/types';
import { ArrowDownIcon } from 'svgs';
import { truncateHash } from 'utils/addressHelpers';
import { computeFiatValuePriceImpact } from 'utils/computeFiatValuePriceImpact';
import AdvancedSwapDetails from './AdvancedSwapDetails';

const FieldAmountCurrency: React.FC<{
  currencyAmount: CurrencyAmount<Currency>;
  fiatValue: CurrencyAmount<Currency>;
  priceImpact?: Percent;
}> = ({ currencyAmount, fiatValue, priceImpact }) => (
  <Card radius="small" variant="panel" padding="16px 20px !important">
    <RowBetween mb="4px">
      <RowFixed gap="10px">
        <Text fontSize="20px" fontWeight={500} color="text">
          {currencyAmount.toExact()}
        </Text>
      </RowFixed>
      <RowFixed gap="8px">
        <CurrencyLogo currency={currencyAmount.currency} size={32} />
        <Text fontSize="20px" fontWeight={500}>
          {currencyAmount.currency.symbol}
        </Text>
      </RowFixed>
    </RowBetween>
    <RowBetween>
      <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
    </RowBetween>
  </Card>
);
const SwapModalHeader = ({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  fiatValueInput,
  fiatValueOutput,
}: {
  trade: InterfaceTrade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;

  fiatValueInput: CurrencyAmount<Currency>;
  fiatValueOutput: CurrencyAmount<Currency>;
}) => {
  const [lastExecutionPrice, setLastExecutionPrice] = useState(trade.executionPrice);
  const [priceUpdate, setPriceUpdate] = useState<number | undefined>();

  // useEffect(() => {
  //   if (!trade.executionPrice.equalTo(lastExecutionPrice)) {
  //     setPriceUpdate(getPriceUpdateBasisPoints(lastExecutionPrice, trade.executionPrice));
  //     setLastExecutionPrice(trade.executionPrice);
  //   }
  // }, [lastExecutionPrice, setLastExecutionPrice, trade.executionPrice]);

  return (
    <AutoColumn>
      <FieldAmountCurrency currencyAmount={trade.inputAmount} fiatValue={fiatValueInput} />
      <RowCenter my="8px">
        <ArrowDownIcon color="primary" />
      </RowCenter>
      <FieldAmountCurrency
        currencyAmount={trade.outputAmount}
        fiatValue={fiatValueOutput}
        priceImpact={computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)}
      />

      <Box my="16px">
        <AdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} />
      </Box>
      {/* 
      {showAcceptChanges || priceUpdate ? (
        <AutoColumn justify="flex-start">
          <RowBetween>
            <RowFixed>
              <Text color="warning">
                <Trans>Price Updated</Trans>
              </Text>
            </RowFixed>
            <Button variant="primary" style={{ height: '36px', fontSize: '14px' }} p="0 20px" onClick={onAcceptChanges}>
              <Trans>Accept</Trans>
            </Button>
          </RowBetween>
        </AutoColumn>
      ) : null} */}

      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text>
            <Trans>
              Output will be sent to{' '}
              <b title={recipient}>{isAddress(recipient) ? truncateHash(recipient, 6, 8) : recipient}</b>
            </Trans>
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
};
export default SwapModalHeader;
