/* eslint-disable react/style-prop-object */
/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const Pools: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg fill="transparent" viewBox="0 0 24 24" {...props}>
      <path
        d="M17.54 8.31001C18.8986 8.31001 20 7.20863 20 5.85001C20 4.49139 18.8986 3.39001 17.54 3.39001C16.1814 3.39001 15.08 4.49139 15.08 5.85001C15.08 7.20863 16.1814 8.31001 17.54 8.31001Z"
        stroke="#DADADA"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.46001 8.31001C7.81863 8.31001 8.92 7.20863 8.92 5.85001C8.92 4.49139 7.81863 3.39001 6.46001 3.39001C5.10139 3.39001 4 4.49139 4 5.85001C4 7.20863 5.10139 8.31001 6.46001 8.31001Z"
        stroke="#DADADA"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.54 20.61C18.8986 20.61 20 19.5086 20 18.15C20 16.7914 18.8986 15.69 17.54 15.69C16.1814 15.69 15.08 16.7914 15.08 18.15C15.08 19.5086 16.1814 20.61 17.54 20.61Z"
        stroke="#DADADA"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.46001 20.61C7.81863 20.61 8.92 19.5086 8.92 18.15C8.92 16.7914 7.81863 15.69 6.46001 15.69C5.10139 15.69 4 16.7914 4 18.15C4 19.5086 5.10139 20.61 6.46001 20.61Z"
        stroke="#DADADA"
        strokeOpacity="0.8"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Pools;
