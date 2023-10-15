import styled from 'styled-components';
import { space, typography, layout } from 'styled-system';
import { getColorTheme } from 'styles/utils';
import { textScales, TextProps } from './types';

export const styleScaleText = {
  [textScales.xs]: {
    fontSize: '10px',
    fontSizeXs: '12px',
    fontSizeMd: '12px',
  },
  [textScales.sm]: {
    fontSize: '12px',
    fontSizeXs: '13px',
    fontSizeMd: '14px',
  },
  [textScales.md]: {
    fontSize: '14px',
    fontSizeXs: '15px',
    fontSizeMd: '16px',
  },
  [textScales.lg]: {
    fontSize: '14px',
    fontSizeXs: '16px',
    fontSizeMd: '18px',
  },
  [textScales.xl]: {
    fontSize: '16px',
    fontSizeXs: '18px',
    fontSizeMd: '20px',
  },
};

const getFontSize = ({ fontSize }: TextProps) => fontSize;

const Text = styled.div<TextProps>`
  color: ${getColorTheme};
  font-weight: ${({ bold }) => (bold ? 700 : 500)};
  font-size: ${({ scale, fontSize, small }) =>
    small ? '12px' : getFontSize({ fontSize }) || styleScaleText[scale].fontSize};
  line-height: ${({ scale, fontSize }) => `calc(${fontSize || styleScaleText[scale].fontSize} + 6px)`};

  white-space: ${({ whiteSpace }) => whiteSpace ?? 'normal'};

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: ${({ scale, fontSize }) => fontSize || styleScaleText[scale].fontSizeXs};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: ${({ scale, fontSize }) => fontSize || styleScaleText[scale].fontSizeMd};
  }

  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}

  ${({ ellipsis }) =>
    ellipsis > 0 &&
    `overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${ellipsis};
    -webkit-box-orient: vertical;
    `}

  ${({ gradient }) =>
    gradient &&
    `
    background: ${gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    `}

  ${space}
  ${typography}
  ${layout}
`;

Text.defaultProps = {
  color: 'text',
  className: 'text',
  scale: textScales.sm,
};

export default Text;
