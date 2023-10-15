/* eslint-disable react/style-prop-object */
/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const Telegram = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path
        d="M19.7013 6.20188L17.3251 17.4081C17.1456 18.1989 16.6783 18.3958 16.014 18.0234L12.3932 15.3553L10.6463 17.0358C10.4528 17.2293 10.2914 17.3907 9.91851 17.3907L10.1789 13.7035L16.8892 7.63999C17.1811 7.38015 16.8256 7.23561 16.4359 7.49601L8.14013 12.7198L4.56874 11.6017C3.79204 11.3593 3.77798 10.825 4.73072 10.4521L18.6996 5.07028C19.3464 4.82788 19.9122 5.2137 19.7013 6.20188Z"
        fill="#B7BDC6"
      />
    </Svg>
  );
};

export default Telegram;
