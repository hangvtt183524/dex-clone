import { Box } from 'components/Box';
import { RowFixed } from 'components/Layout/Row';
import Text from 'components/Text';
import { TextProps } from 'components/Text/types';
import React, { useContext, useMemo } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { variant as systemVariant, space } from 'styled-system';
import RoboTheme from 'styles';
import { ErrorIcon, SuccessIcon, WarningOutLineIcon } from 'svgs';
import variants from './theme';
import { MessageProps } from './types';

interface ThemeProps extends TextProps {
  theme: DefaultTheme;
}

const MessageContext = React.createContext<MessageProps>({
  variant: 'success',
});

const Icons = {
  warning: WarningOutLineIcon,
  failure: ErrorIcon,
  success: SuccessIcon,
};

const getColor = ({ variant, theme }: Pick<MessageProps, 'variant'> & ThemeProps) =>
  theme.colors[variant] || theme.colors.warning;

const MessageContainer = styled.div<MessageProps>`
  background-color: gray;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.medium};
  border: solid 1px;
  color: ${getColor};

  svg {
    color: ${({ theme, variant }) => theme.colors[variant] || theme.colors.failure};

    &:not(.warning) {
      fill: ${({ theme, variant }) => theme.colors[variant] || theme.colors.failure};
    }
  }

  ${space}
  ${systemVariant({
    variants,
  })}
`;

const colors = {
  warning: RoboTheme.colors.warning,
  success: RoboTheme.colors.success,
  failure: RoboTheme.colors.failure,
};

export const MessageText: React.FC<React.PropsWithChildren<TextProps>> = ({ children, ...props }) => {
  const ctx = useContext(MessageContext);
  return (
    <Text color={colors[ctx?.variant]} {...props}>
      {children}
    </Text>
  );
};

const Message: React.FC<React.PropsWithChildren<MessageProps>> = ({
  children,
  variant,
  icon,
  action,
  actionInline,
  ...props
}) => {
  const messageMemo = useMemo(() => ({ variant }), [variant]);

  const Icon = Icons[variant];
  return (
    <MessageContext.Provider value={messageMemo}>
      <MessageContainer variant={variant} {...props}>
        <RowFixed>
          <StyledWrapIcon color={variants[variant].borderColor} mr="12px">
            {icon ?? <Icon className={variant} width="24px" />}
          </StyledWrapIcon>
          {children}
          {actionInline && action}
        </RowFixed>
        {!actionInline && action}
      </MessageContainer>
    </MessageContext.Provider>
  );
};

const StyledWrapIcon = styled(Box)<{ color: string }>`
  svg {
    path: ${({ color }) => color};
  }
`;

export default Message;
