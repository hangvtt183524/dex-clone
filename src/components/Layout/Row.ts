import { Flex } from 'components/Box';
import styled from 'styled-components';

export const Row = styled(Flex)`
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

export const RowMiddle = styled(Row)`
  width: 100%;
  align-items: center;
`;
RowMiddle.defaultProps = {
  minWidth: 'max-content',
};

export const RowCenter = styled(Row)`
  justify-content: center;
`;
export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify};
  width: calc(100% + ${({ gap }) => gap} * 2);

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;
