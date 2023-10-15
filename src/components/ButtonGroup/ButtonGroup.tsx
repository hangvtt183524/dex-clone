import { Grid, GridProps } from 'components/Box';
import React, { ReactNode } from 'react';

const ButtonGroup: React.FC<{ children: ReactNode | ReactNode[] } & GridProps> = ({
  children,
  gridGap = '8px',
  ...props
}) => {
  return (
    <Grid gridGap={gridGap} gridTemplateColumns={`repeat(${React.Children.count(children)}, 1fr)`} {...props}>
      {children}
    </Grid>
  );
};

export default ButtonGroup;
