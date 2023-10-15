/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const CheckMarkGradient  = (props) => {
  return (
    <Svg viewBox="0 0 20 20" fill="transparent" {...props}>
      <path
        d="M6 9.5L8.66353 12L14 7"
        stroke="url(#paint0_linear_7478_68951)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9.5L8.66353 12L14 7"
        stroke="black"
        strokeOpacity="0.05"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_7478_68951"
          x1="5.87978"
          y1="7"
          x2="14.1675"
          y2="7.29501"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0096F2" />
          <stop offset="1" stopColor="#7AE6F4" />
        </linearGradient>
      </defs>{' '}
    </Svg>
  );
};

export default CheckMarkGradient;
