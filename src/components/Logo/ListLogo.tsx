import React from 'react';
import uriToHttp from 'utils/uriToHttp';
import Logo from './Logo';

const ListLogo = ({
  logoURI,
  style,
  size = 24,
  alt,
}: {
  logoURI: string;
  size?: number;
  style?: React.CSSProperties;
  alt?: string;
}) => {
  const srcs: string[] = logoURI ? uriToHttp(logoURI) : [];

  return <Logo className="list-logo" alt={alt} size={size} srcs={srcs} style={style} />;
};
export default ListLogo;
