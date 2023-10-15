import IconButton from 'components/Button/IconButton';
import Heading from 'components/Heading';
import { AutoRow, RowBetween } from 'components/Layout/Row';
import useTransactionModal from 'components/TransactionModal/hooks';
import { useUserSettingsModal } from 'components/UserSettingsModal/hooks';
import { explainField } from 'config/explain';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import useRefreshBlockNumber from 'hooks/useRefreshBlockNumber';
import useTooltip from 'hooks/useTooltip';
import React, { useCallback } from 'react';
import { useSwapState } from 'state/swap/hooks';
import RoboTheme from 'styles';
import { HistoryIcon, RefreshIcon, SettingIcon } from 'svgs';

const SwapHeader = () => {
  const { typedValue } = useSwapState();

  const { onPressentUserSettingsModal } = useUserSettingsModal();
  const { onPressentTransactionModal } = useTransactionModal();
  const { refreshBlockNumber } = useRefreshBlockNumber();
  const { isDesktop } = useMatchBreakpoints();

  const { targetRef, tooltip, tooltipVisible } = useTooltip(explainField.refreshPrice, {
    placement: 'top-start',
    trigger: 'hover',
  });

  const {
    targetRef: targetRefHistory,
    tooltip: tooltipHistory,
    tooltipVisible: tooltipVisibleHistory,
  } = useTooltip(explainField.transactionHistory, {
    placement: 'top',
    trigger: 'hover',
  });

  const {
    targetRef: targetRefSettings,
    tooltip: tooltipSettings,
    tooltipVisible: tooltipVisibleSettings,
  } = useTooltip(explainField.settings, {
    placement: 'right',
    trigger: 'hover',
  });

  const onRefreshPrice = useCallback(() => {
    if (typedValue) {
      refreshBlockNumber();
    }
  }, [typedValue, refreshBlockNumber]);

  return (
    <RowBetween>
      <Heading gradient={RoboTheme.colors.gradients.primary}>Swap</Heading>
      <AutoRow gap="12px" width="max-content !important" flex="initial">
        <IconButton ref={isDesktop ? targetRef : null} onClick={onRefreshPrice}>
          <RefreshIcon />
          {tooltipVisible && tooltip}
        </IconButton>

        <IconButton ref={isDesktop ? targetRefHistory : null} onClick={onPressentTransactionModal}>
          <HistoryIcon />
          {tooltipVisibleHistory && tooltipHistory}
        </IconButton>

        <IconButton ref={isDesktop ? targetRefSettings : null} onClick={onPressentUserSettingsModal}>
          <SettingIcon />
          {tooltipVisibleSettings && tooltipSettings}
        </IconButton>
      </AutoRow>
    </RowBetween>
  );
};

export default SwapHeader;
