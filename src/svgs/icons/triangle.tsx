/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';
import RoboTheme from 'styles';

const TriangleIcon= (props) => {
  return (
    <Svg viewBox="0 0 9 6" {...props}>
      <path
        d="M8.31686 5.5L0.683144 5.5C0.548023 5.49997 0.415945 5.4613 0.303605 5.38887C0.191265 5.31644 0.103709 5.21351 0.0520048 5.09309C0.000300407 4.97267 -0.0132313 4.84016 0.0131216 4.71232C0.0394745 4.58448 0.104528 4.46705 0.200059 4.37487L4.01691 0.692984C4.14505 0.569416 4.31882 0.5 4.5 0.5C4.68118 0.5 4.85495 0.569416 4.98309 0.692984L8.79994 4.37487C8.89547 4.46705 8.96053 4.58448 8.98688 4.71232C9.01323 4.84016 8.9997 4.97267 8.948 5.09309C8.89629 5.21351 8.80873 5.31644 8.69639 5.38887C8.58406 5.4613 8.45198 5.49997 8.31686 5.5Z"
        fill={RoboTheme.colors.mark}
      />
    </Svg>
  );
};

export default TriangleIcon;
