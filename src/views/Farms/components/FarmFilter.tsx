import { BoxProps } from 'components/Box';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import React from 'react';
import Filter from 'views/Farms/components/Filter';

const FarmFilter: React.FC<{ isMobile?: boolean; hideFarm?: boolean } & BoxProps> = ({
  isMobile = false,
  hideFarm,
  ...props
}) => {
  const { isTablet, isMobile: isMobilePoint } = useMatchBreakpoints();

  const check = isMobile ? isMobilePoint || isTablet : !isTablet && !isMobilePoint;
  return check && <Filter hideFarm={hideFarm} {...props} />;
};

export default React.memo(FarmFilter);
