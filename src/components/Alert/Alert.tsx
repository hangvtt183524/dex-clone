import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { CloseIcon, DangerIcon, ErrorToastIcon, InfoToastIcon, SuccessToastIcon } from 'svgs';
import Text from 'components/Text';
import IconButton from 'components/Button/IconButton';
import { Box } from 'components/Box';
import { AlertProps, variants } from './types';
import Flex from '../Box/Flex';

interface ThemedIconLabel {
  variant: AlertProps['variant'];
  theme: DefaultTheme;
  hasDescription: boolean;
}

// const getThemeColor = ({ theme, variant = variants.INFO }: ThemedIconLabel) => {
//   switch (variant) {
//     case variants.DANGER:
//       return theme.colors.failure;
//     case variants.WARNING:
//       return theme.colors.warning;
//     case variants.SUCCESS:
//       return theme.colors.success;
//     case variants.INFO:
//     default:
//       return theme.colors.bgDisabled;
//   }
// };

const getIcon = (variant: AlertProps['variant'] = variants.INFO) => {
  switch (variant) {
    case variants.DANGER:
      return ErrorToastIcon;
    case variants.WARNING:
      return DangerIcon;
    case variants.SUCCESS:
      return SuccessToastIcon;
    case variants.INFO:
    default:
      return InfoToastIcon;
  }
};

const IconLabel = styled(Box)<ThemedIconLabel>`
  padding: 12px 16px;
`;

const withHandlerSpacing = 32 + 12 + 8; // button size + inner spacing + handler position
const Details = styled.div<{ hasHandler: boolean }>`
  flex: 1;
  padding-bottom: 12px;
  padding-left: 0;
  padding-right: ${({ hasHandler }) => (hasHandler ? `${withHandlerSpacing}px` : '12px')};
  padding-top: 12px;
`;

const CloseHandler = styled.div`
  border-radius: 0 16px 16px 0;
  right: 8px;
  position: absolute;
  top: 8px;
`;

const StyledAlert = styled(Flex)`
  position: relative;
  background-color: #212935;
  border-radius: ${({ theme }) => theme.radius.tiny};
`;

const Alert: React.FC<React.PropsWithChildren<AlertProps>> = ({ title, children, variant, onClick }) => {
  const Icon = getIcon(variant);

  return (
    <StyledAlert>
      <IconLabel variant={variant} hasDescription={!!children}>
        <Icon />
      </IconLabel>
      <Details hasHandler={!!onClick}>
        <Text scale="lg" bold>
          {title}
        </Text>
        {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      </Details>
      {onClick && (
        <CloseHandler>
          <IconButton scale="sm" variant="text" onClick={onClick}>
            <CloseIcon width="24px" fill="#FFF" />
          </IconButton>
        </CloseHandler>
      )}
    </StyledAlert>
  );
};

export default Alert;
