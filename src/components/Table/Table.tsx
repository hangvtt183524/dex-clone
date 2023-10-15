import { Box } from 'components/Box';
import styled from 'styled-components';
import { space } from 'styled-system';
import { getBackgroundTheme } from 'styles/utils';
import { ColorVariant } from 'styles/types';

import { Td } from './Cell';

const Table = styled(Box).attrs({ as: 'table' })<{ background?: ColorVariant }>`
  max-width: 100%;
  width: 100%;
  background: ${getBackgroundTheme};
  border-radius: ${({ theme }) => theme.radius.medium};
  overflow: hidden;

  tbody tr:last-child {
    ${Td} {
      border-bottom: 0;
    }
  }

  ${space}
`;

export default Table;
