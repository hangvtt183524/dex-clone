/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const WarningOutLine = (props) => {
  return (
    <Svg width="40px" height="40px" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M12 9V14" stroke="#ED8936" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M11.9994 21.4112H5.93944C2.46944 21.4112 1.01944 18.9312 2.69944 15.9012L5.81944 10.2812L8.75944 5.00125C10.5394 1.79125 13.4594 1.79125 15.2394 5.00125L18.1794 10.2913L21.2994 15.9113C22.9794 18.9413 21.5194 21.4212 18.0594 21.4212H11.9994V21.4112Z"
        stroke="#ED8936"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.9961 17H12.0051" stroke="#ED8936" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />{' '}
    </Svg>
  );
};

export default WarningOutLine;
