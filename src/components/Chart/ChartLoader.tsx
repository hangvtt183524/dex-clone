import { Box } from 'components/Box';
import React from 'react';
import styled from 'styled-components';
import LineChartLoaderSVG from './ChartLoaderSvg';

export const LineChartLoader: React.FC = () => {
  return (
    <LoadingIndicator>
      <LineChartLoaderSVG />
      <LoadingText>
        <StyledText color="textSubtle">Loading chart data...</StyledText>
      </LoadingText>
    </LoadingIndicator>
  );
};

const LoadingIndicator = styled(Box)`
  height: 100%;
  position: relative;
`;

const LoadingText = styled(Box)`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
`;

const StyledText = styled.span`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`;
