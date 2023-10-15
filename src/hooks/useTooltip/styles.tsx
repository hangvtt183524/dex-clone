import { Box } from 'components/Box';
import styled from 'styled-components';
import { getBackgroundTheme } from 'styles/utils';
import { ColorVariant } from 'styles/types';

export const Arrow = styled(Box)<{ background?: ColorVariant | string }>`
  background: transparent !important;

  transform: rotate(45deg);
  &,
  &::before {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    z-index: 11;
    transform: rotate(45deg);
  }

  &::before {
    content: '';
    transform: rotate(45deg);
    background: ${({ theme, background }) => getBackgroundTheme({ theme, background }) || theme.colors.tooltip};
  }
`;

export const StyledTooltip = styled(Box)<{ background?: ColorVariant | string }>`
  padding: 12px;
  font-size: 12px;
  line-height: 130%;
  border-radius: ${({ theme }) => theme.radius.small};
  max-width: 320px;
  background: ${({ theme, background }) => getBackgroundTheme({ theme, background }) || theme.colors.tooltip};
  backdrop-filter: blur(5px);
  color: ${({ theme }) => theme.colors.text};
  z-index: ${({ theme }) => theme.zIndices.modal};

  &[data-popper-placement^='top'] > ${Arrow} {
    bottom: -4px;
  }

  &[data-popper-placement^='bottom'] > ${Arrow} {
    top: -4px;
  }

  &[data-popper-placement^='left'] > ${Arrow} {
    right: -4px;
  }

  &[data-popper-placement^='right'] > ${Arrow} {
    left: -4px;
  }
`;
