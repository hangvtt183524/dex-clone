import { Box } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import Heading from 'components/Heading';
import { RowBetween } from 'components/Layout/Row';
import { useUserSettingsModal } from 'components/UserSettingsModal/hooks';
import { explainField } from 'config/explain';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import useTooltip from 'hooks/useTooltip';
import Router from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { ArrowLeftBackIcon, SettingIcon } from 'svgs';

const HeaderAddLiquidity = styled(RowBetween)`
  width: 100%;
  margin-bottom: 16px;
`;

const MintHeader = () => {
  const { onPressentUserSettingsModal } = useUserSettingsModal();
  const { isDesktop } = useMatchBreakpoints();
  const {
    targetRef: targetRefSettings,
    tooltip: tooltipSettings,
    tooltipVisible: tooltipVisibleSettings,
  } = useTooltip(explainField.settings, {
    placement: 'right',
    trigger: 'hover',
  });

  return (
    <HeaderAddLiquidity>
      <IconButton
        onClick={() => {
          Router.back();
        }}
      >
        <ArrowLeftBackIcon />
      </IconButton>
      <Heading>Add Liquidity</Heading>

      <Box ref={isDesktop ? targetRefSettings : null}>
        <IconButton onClick={onPressentUserSettingsModal} width="38px !important" height="38px !important">
          <SettingIcon />
        </IconButton>
        {tooltipVisibleSettings && tooltipSettings}
      </Box>
    </HeaderAddLiquidity>
  );
};

export default React.memo(MintHeader);
