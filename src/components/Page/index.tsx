import { Flex, FlexProps } from 'components/Box';
import React from 'react';

const Page: React.FC<{ children: React.ReactNode } & FlexProps> = ({ children, style, ...props }) => {
  return (
    <Flex
      width="100%"
      flex={1}
      flexDirection="column"
      p={['12px', '12px 16px', '20px 24px']}
      style={{
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default Page;
