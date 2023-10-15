import { Box, BoxProps } from 'components/Box';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';

const SuccessAniIcon: React.FC<BoxProps & { size?: string; status?: 'success' | 'error' }> = ({
  size = '24px',
  status,
  ...props
}) => {
  const renderFailure = useMemo(
    () => (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
        <circle
          className="path circle"
          fill="none"
          stroke={RoboTheme.colors.failure}
          strokeWidth="6"
          strokeMiterlimit="10"
          cx="65.1"
          cy="65.1"
          r="62.1"
        />
        <line
          className="path line"
          fill="none"
          stroke={RoboTheme.colors.failure}
          strokeWidth="6"
          strokeLinecap="round"
          strokeMiterlimit="10"
          x1="34.4"
          y1="37.9"
          x2="95.8"
          y2="92.3"
        />
        <line
          className="path line"
          fill="none"
          stroke={RoboTheme.colors.failure}
          strokeWidth="6"
          strokeLinecap="round"
          strokeMiterlimit="10"
          x1="95.8"
          y1="38"
          x2="34.4"
          y2="92.2"
        />
      </svg>
    ),
    [],
  );

  const renderSuccess = useMemo(
    () => (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
        <circle
          className="path circle"
          fill="none"
          stroke={RoboTheme.colors.success}
          strokeWidth="6"
          strokeMiterlimit="10"
          cx="65.1"
          cy="65.1"
          r="62.1"
        />
        <polyline
          className="path check"
          fill="none"
          stroke={RoboTheme.colors.success}
          strokeWidth="6"
          strokeLinecap="round"
          strokeMiterlimit="10"
          points="100.2,40.2 51.5,88.8 29.8,67.5 "
        />
      </svg>
    ),
    [],
  );

  return (
    <StyledWrapper width={size} height={`calc(${size} + 2px)`} {...props}>
      {status === 'success' ? renderSuccess : renderFailure}
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Box)`
  .path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
    /* &.circle {
      -webkit-animation: dash 0.9s ease-in-out;
      animation: dash 0.9s ease-in-out;
    }
    &.line {
      stroke-dashoffset: 1000;
      -webkit-animation: dash 0.9s 0.35s ease-in-out forwards;
      animation: dash 0.9s 0.35s ease-in-out forwards;
    }
    &.check {
      stroke-dashoffset: -100;
      -webkit-animation: dash-check 0.9s 0.35s ease-in-out forwards;
      animation: dash-check 0.9s 0.35s ease-in-out forwards;
    } */
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: 1000;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes dash-check {
    0% {
      stroke-dashoffset: -100;
    }
    100% {
      stroke-dashoffset: 900;
    }
  }
`;
export default SuccessAniIcon;
