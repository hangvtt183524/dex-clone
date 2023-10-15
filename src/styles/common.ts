import { Box } from 'components/Box';
import styled from 'styled-components';

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;

export const ShadowForm = styled(Box)`
  content: ' ';
  position: absolute;
  left: -15%;
  top: -20%;
  width: 200px;
  height: 200px;

  background: linear-gradient(91.27deg, rgba(0, 150, 242, 1) -1.47%, rgba(122, 230, 244, 1) 100%);
  opacity: 0.7;
  filter: blur(75px);
  transform: rotate(145.59deg);
  z-index: 0;
`;

export const LineStroke = styled(Box)`
  width: 100%;
  height: 1px;
  border: 1px solid #353b47;
`;
