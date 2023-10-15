import Box from 'components/Box/Box';
import useTooltip from 'hooks/useTooltip';
import React from 'react';
import styled from 'styled-components';
import { ErrorIcon } from 'svgs';
import { BoxProps, Flex } from 'components/Box';
import RoboTheme from 'styles';
import { Placement } from './types';

interface QuestionHelperProps extends BoxProps {
  text: string | React.ReactNode;
  placement?: Placement;
  size?: string;
  maxWidth?: string;
}

const QuestionWrapper = styled(Flex)`
  svg {
    width: 22px;
    height: 22px;
  }
  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const QuestionHelper: React.FC<QuestionHelperProps> = ({
  text,
  placement = 'right-end',
  size = '16px',
  maxWidth,
  ...props
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, {
    placement,
    trigger: 'hover',
    maxWidth,
  });
  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        <ErrorIcon fill={RoboTheme.colors.textSubtle} width={size} />
      </QuestionWrapper>
    </Box>
  );
};

export default QuestionHelper;
