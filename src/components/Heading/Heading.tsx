import Text from 'components/Text';
import styled from 'styled-components';
import { tags, scales, HeadingProps } from './types';

const style = {
  [scales.MD]: {
    fontSize: '16px',
    fontSizeLg: '18px',
  },
  [scales.LG]: {
    fontSize: '20px',
    fontSizeLg: '24px',
  },
  [scales.XL]: {
    fontSize: '24px',
    fontSizeLg: '32px',
  },
  [scales.XXL]: {
    fontSize: '48px',
    fontSizeLg: '64px',
  },
};

const Heading = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ scale }) => style[scale].fontSize};
  font-weight: 600;
  line-height: 1.1;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: ${({ scale }) => style[scale].fontSizeLg};
  }
`;

Heading.defaultProps = {
  as: tags.H2,
  scale: scales.MD,
};

export default Heading;
