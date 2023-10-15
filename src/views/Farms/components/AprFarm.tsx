import { Box } from 'components/Box';
import Text from 'components/Text';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled(Box)`
  li {
    margin-left: 8px;
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 12px;
  }
`;
const AprFarm = () => {
  return (
    <StyledWrapper>
      <Text color="text" fontSize="12px" mb="4px">
        Annual Percentage Rate (APR): 60%
      </Text>
      <li>Liquidity Mining (Farm): 45% </li>
      <li>LP Rewards: 15%</li>
    </StyledWrapper>
  );
};

export default AprFarm;
