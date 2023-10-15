import { Box } from 'components/Box';
import styled from 'styled-components';
import { space, SpaceProps, typography, TypographyProps } from 'styled-system';
import { ColorVariant } from 'styles/types';

import { getBackgroundTheme, getColorTheme } from 'styles/utils';

export interface TableProps extends TypographyProps, SpaceProps {
  background?: ColorVariant | string;
  color?: ColorVariant | string;
}

export const Tr = styled(Box).attrs({ as: 'tr' })<TableProps>`
  ${typography}
  ${space}
`;

export const Td = styled(Box).attrs({ as: 'td' })<TableProps & { colSpan?: number }>`
  color: #fff;
  padding: 24px;

  vertical-align: middle;

  ${typography}
  ${space}
`;

export const Th = styled(Td).attrs({ as: 'th' })`
  color: ${({ theme, color }) => getColorTheme({ theme, color }) || theme.colors.text};

  padding: 24px;
  font-size: 14px;

  ${typography}
  ${space}
`;

export const Thead = styled.thead<TableProps>`
  color: ${({ theme, color }) => getColorTheme({ theme, color }) || 'textAlt4'};

  ${typography}
  ${space}
`;

export const TableBody = styled.tbody<TableProps>`
  background: ${({ theme, background }) => getBackgroundTheme({ theme, background }) || theme.colors.form};

  ${typography}
  ${space}
`;
