import BigNumber from 'bignumber.js';
import { Flex } from 'components/Box';
import Text from 'components/Text';
import React from 'react';

import styled from 'styled-components';

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button';
  pid: number;
  lpSymbol: string;
  lpLabel?: string;
  multiplier: string;
  roboPrice?: BigNumber;
  apr?: number;
  displayApr?: string;
  lpRewardsApr?: number;
  addLiquidityUrl?: string;
  strikethrough?: boolean;
  useTooltipText?: boolean;
  hideButton?: boolean;
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  // variant,
  // pid,
  // lpLabel,
  // lpSymbol,
  // roboPrice,
  // apr,
  // multiplier,
  displayApr,
  // lpRewardsApr,
  // addLiquidityUrl,
  strikethrough,
  useTooltipText,
  hideButton,
}) => {
  const handleClickButton = (event): void => {
    event.stopPropagation();
  };

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <ApyLabelContainer
        alignItems="center"
        onClick={(event) => {
          if (hideButton) return;
          handleClickButton(event);
        }}
        style={strikethrough && { textDecoration: 'line-through' }}
      >
        {useTooltipText ? (
          <>
            <Text
              // ref={targetRef}
              fontSize={['12px', '', '', '', '', '14px']}
            >
              {displayApr}%
            </Text>
            {/* {tooltipVisible && tooltip} */}
          </>
        ) : (
          <>{displayApr}%</>
        )}
        {/* {variant === 'text-and-button' && (
          <IconButton variant="text" scale="sm" ml="4px">
            <CalculateIcon width="18px" />
          </IconButton>
        )} */}
      </ApyLabelContainer>
    </Flex>
  );
};

export default ApyButton;
