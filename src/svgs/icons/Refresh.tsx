/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const Refresh = (props) => {
  return (
    <Svg viewBox="0 0 20 20" fill="transparent" {...props}>
      <path
        d="M12.4077 4.23333C11.6827 4.01667 10.8827 3.875 9.99941 3.875C6.00775 3.875 2.77441 7.10833 2.77441 11.1C2.77441 15.1 6.00775 18.3333 9.99941 18.3333C13.9911 18.3333 17.2244 15.1 17.2244 11.1083C17.2244 9.625 16.7744 8.24167 16.0077 7.09167"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.441 4.43317L11.0327 1.6665"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.4411 4.43311L10.6328 6.48311"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Refresh;
