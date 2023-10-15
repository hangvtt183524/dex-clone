import { Box, BoxProps } from 'components/Box';
import React from 'react';
import styled from 'styled-components';

const Loading: React.FC<BoxProps & { size?: number; color?: string }> = ({ size = '40px', ...props }) => {
  return <Wrapper {...props} width={size} height={size} />;
};

const Wrapper = styled(Box)`
  transform: rotateZ(45deg);
  perspective: 1000px;
  border-radius: 50%;
  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;
    border-radius: 50%;
    animation: 1s spin linear infinite;
  }
  &:before {
    transform: rotateX(70deg);
  }
  &:after {
    transform: rotateY(70deg);
    animation-delay: 0.4s;
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotateZ(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotateZ(360deg);
    }
  }

  @keyframes rotateccw {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(-360deg);
    }
  }

  @keyframes spin {
    0%,
    100% {
      box-shadow: 0.2em 0px 0 0px ${({ color }) => color ?? 'currentColor'};
    }
    12% {
      box-shadow: 0.2em 0.2em 0 0 ${({ color }) => color ?? 'currentColor'};
    }
    25% {
      box-shadow: 0 0.2em 0 0px ${({ color }) => color ?? 'currentColor'};
    }
    37% {
      box-shadow: -0.2em 0.2em 0 0 ${({ color }) => color ?? 'currentColor'};
    }
    50% {
      box-shadow: -0.2em 0 0 0 ${({ color }) => color ?? 'currentColor'};
    }
    62% {
      box-shadow: -0.2em -0.2em 0 0 ${({ color }) => color ?? 'currentColor'};
    }
    75% {
      box-shadow: 0px -0.2em 0 0 ${({ color }) => color ?? 'currentColor'};
    }
    87% {
      box-shadow: 0.2em -0.2em 0 0 ${({ color }) => color ?? 'currentColor'};
    }
  }
`;
export default Loading;
