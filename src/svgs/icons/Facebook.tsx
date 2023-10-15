/* eslint-disable react/style-prop-object */
/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const Facebook = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path
        d="M13.337 12.9678H15.1829L15.9213 10.0143H13.337V8.5376C13.337 7.77709 13.337 7.06087 14.8137 7.06087H15.9213V4.57996C15.6806 4.54821 14.7717 4.47659 13.8118 4.47659C11.8071 4.47659 10.3836 5.70007 10.3836 7.94691V10.0143H8.16846V12.9678H10.3836V19.2439H13.337V12.9678Z"
        fill="#B7BDC6"
      />
    </Svg>
  );
};

export default Facebook;
