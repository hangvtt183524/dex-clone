import React from 'react';
import styled from 'styled-components';
import Text from 'components/Text';
import { NextLinkFromReactRouter } from './NextLink';

import { LinkProps } from './types';

const StyledLink = styled(Text)<LinkProps>`
  display: flex;
  align-items: center;
  width: fit-content;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;
export const getExternalLinkProps = (): { target: string; rel: string } => ({
  target: '_blank',
  rel: 'noreferrer noopener',
});

const Link: React.FC<LinkProps> = ({ external, href = '', color = 'textSubtle', ...props }) => {
  const internalProps = external ? getExternalLinkProps() : {};
  return (
    <StyledLink
      as={external ? 'a' : NextLinkFromReactRouter}
      to={href}
      href={href}
      color={color}
      {...internalProps}
      {...props}
    />
  );
};

export default Link;
