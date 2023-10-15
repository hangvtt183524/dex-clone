import React, { forwardRef } from 'react';
import NextLink from 'next/link';

// react-router-dom LinkProps types
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  innerRef?: React.Ref<HTMLAnchorElement>;
  // next
  prefetch?: boolean;
}

/**
 * temporary solution for migrating React Router to Next.js Link
 */
export const NextLinkFromReactRouter = forwardRef<any, LinkProps>(function renderLink(
  { to, replace, children, prefetch, ...props },
  ref,
) {
  return (
    <NextLink href={to as string} replace={replace} passHref prefetch={prefetch} ref={ref} {...props}>
      {children}
    </NextLink>
  );
}) as any;
