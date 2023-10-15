import { Box } from 'components/Box';
import ButtonBorderGradient from 'components/Button/ButtonBorderGradient';
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

const Wrapper = styled(RowBetween)`
  width: 100%;
  margin-bottom: 12px;
`;

const BurnHeader = () => {
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
    <Wrapper>
      <IconButton
        onClick={() => {
          Router.back();
        }}
      >
        <ArrowLeftBackIcon />
      </IconButton>
      <Heading>Remove Liquidity (V2)</Heading>

      <Box ref={isDesktop ? targetRefSettings : null} onClick={onPressentUserSettingsModal}>
        <ButtonBorderGradient width="38px !important" height="38px !important">
          <SettingIcon />
        </ButtonBorderGradient>
        {tooltipVisibleSettings && tooltipSettings}
      </Box>
    </Wrapper>
  );
};

export default React.memo(BurnHeader);
