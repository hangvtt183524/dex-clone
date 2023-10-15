import React from 'react';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import PoolsTableDesktop from './PoolsTableDesktop';
import PoolTableMobile from './PoolTableMobile';
import { PoolTableProps } from './types';

const PoolTable: React.FC<PoolTableProps> = ({ ...props }) => {
  const { isMobile } = useMatchBreakpoints();

  return !isMobile ? <PoolsTableDesktop {...props} /> : <PoolTableMobile {...props} />;
};

export default PoolTable;
