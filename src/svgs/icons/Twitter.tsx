/* eslint-disable react/style-prop-object */
/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const Twitter: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path
        d="M8.72458 18.2069C14.3941 18.2069 17.4942 13.5097 17.4942 9.43723C17.4942 9.30394 17.4942 9.17065 17.4859 9.03855C18.0891 8.60208 18.6097 8.06168 19.0235 7.44267C18.4612 7.69207 17.8647 7.85574 17.2538 7.92822C17.897 7.54265 18.3783 6.93663 18.6081 6.22285C18.003 6.58207 17.3409 6.83523 16.6505 6.9714C16.1858 6.47732 15.5712 6.15016 14.9019 6.04055C14.2326 5.93094 13.5458 6.04499 12.9478 6.36506C12.3498 6.68512 11.874 7.19335 11.5939 7.8111C11.3139 8.42885 11.2453 9.12167 11.3987 9.78235C10.1732 9.72095 8.97434 9.40252 7.87992 8.84773C6.7855 8.29293 5.81999 7.51417 5.04607 6.56202C4.65152 7.24037 4.53034 8.04361 4.70722 8.80817C4.8841 9.57273 5.34574 10.2411 5.99813 10.6773C5.51099 10.6608 5.03484 10.5282 4.60932 10.2905V10.3298C4.60923 11.0406 4.85474 11.7296 5.3043 12.2803C5.75386 12.8309 6.37985 13.2093 7.07633 13.3514C6.62231 13.475 6.14598 13.493 5.68395 13.4037C5.88066 14.0165 6.26405 14.5525 6.78046 14.9366C7.29686 15.3207 7.92044 15.5337 8.56392 15.5459C7.47143 16.4014 6.12309 16.865 4.73546 16.8621C4.48968 16.8622 4.2441 16.8479 4 16.8192C5.40936 17.7245 7.04952 18.205 8.72458 18.2033"
        fill="#B7BDC6"
      />
    </Svg>
  );
};

export default Twitter;