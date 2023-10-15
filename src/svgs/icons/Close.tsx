/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const Close: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" fill="transparent" {...props}>
      <path
        d="M18.3002 5.7002L5.7002 18.3002M18.3002 18.3002L5.7002 5.7002L18.3002 18.3002Z"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Close;
