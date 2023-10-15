import React from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import { LinkExternalIcon } from 'svgs';
import Link from './Link';
import { LinkProps } from './types';

const StyleLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

const LinkExternal: React.FC<LinkProps> = (props) => {
  return (
    <StyleLink external href={props.href} {...(props as any)}>
      {props?.children}
      {!props?.hideIcon && (
        <LinkExternalIcon size="16px" stroke={props.color ? colors[props.color] : colors.bgDisabled} ml="4px" />
      )}
    </StyleLink>
  );
};

export default LinkExternal;
