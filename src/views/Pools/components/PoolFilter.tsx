/* eslint-disable react/jsx-boolean-value */
import { BoxProps } from 'components/Box';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import React from 'react';
import Filter from 'views/Farms/components/Filter';

const PoolFilter: React.FC<{ isMobile?: boolean } & BoxProps> = ({ isMobile = false, ...props }) => {
  const { isTablet, isMobile: isMobilePoint } = useMatchBreakpoints();

  const check = isMobile ? isMobilePoint || isTablet : !isTablet && !isMobilePoint;
  return check && <Filter hideFarm={true} farmOnly {...props} />;
};

export default React.memo(PoolFilter);
