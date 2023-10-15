import { Box } from 'components/Box';
import styled from 'styled-components';

export const StyledDropdownMenu = styled(Box)<{
  $isOpen: boolean;
  $isBottomNav: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.modal};

  pointer-events: auto;
  margin-bottom: 0;
  border-radius: ${({ theme }) => theme.radius.small};
  width: ${({ $isBottomNav }) => ($isBottomNav ? 'calc(100% - 32px)' : '300px')};
  visibility: visible;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  overflow: hidden;

  ${({ $isOpen }) =>
    !$isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}
`;
