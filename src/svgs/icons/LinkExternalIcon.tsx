import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const LinkExternal = (props) => {
  return (
    <Svg viewBox="0 0 16 16" fill="transparent" {...props}>
      <path
        d="M11.0411 10.5843L11.0411 4.86143L5.31826 4.86143"
        stroke="url(#paint0_linear_5795_49727)"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M1.99986 13.9337L9.93359 6"
        stroke="url(#paint1_linear_5795_49727)"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient
          id="paint0_linear_5795_49727"
          x1="8.09369"
          y1="1.914"
          x2="13.7545"
          y2="8.10205"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0096F2" />
          <stop offset="1" stopColor="#7AE6F4" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_5795_49727"
          x1="9.92297"
          y1="5.98938"
          x2="10.655"
          y2="6.72429"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0096F2" />
          <stop offset="1" stopColor="#7AE6F4" />
        </linearGradient>
      </defs>
    </Svg>
  );
};

export default LinkExternal;
