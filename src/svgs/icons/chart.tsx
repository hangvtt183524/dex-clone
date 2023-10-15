/* eslint-disable max-len */
import Svg from 'components/Svg/Svg';
import { SvgProps } from 'components/Svg/types';
import React from 'react';

const ChartIcon = (props) => {
  return (
    <Svg viewBox="0 0 20 20" fill="textSubtle" {...props}>
      <path d="M17.3438 15.4688H3.90625V3.28125C3.90625 3.19531 3.83594 3.125 3.75 3.125H2.65625C2.57031 3.125 2.5 3.19531 2.5 3.28125V16.7188C2.5 16.8047 2.57031 16.875 2.65625 16.875H17.3438C17.4297 16.875 17.5 16.8047 17.5 16.7188V15.625C17.5 15.5391 17.4297 15.4688 17.3438 15.4688ZM5.97266 12.4551C6.0332 12.5156 6.13086 12.5156 6.19336 12.4551L8.89453 9.76758L11.3867 12.2754C11.4473 12.3359 11.5469 12.3359 11.6074 12.2754L16.9863 6.89844C17.0469 6.83789 17.0469 6.73828 16.9863 6.67773L16.2129 5.9043C16.1835 5.87522 16.1439 5.85891 16.1025 5.85891C16.0612 5.85891 16.0216 5.87522 15.9922 5.9043L11.5 10.3945L9.01172 7.89062C8.98235 7.86155 8.94269 7.84523 8.90137 7.84523C8.86004 7.84523 8.82038 7.86155 8.79102 7.89062L5.20117 11.459C5.17209 11.4884 5.15578 11.528 5.15578 11.5693C5.15578 11.6107 5.17209 11.6503 5.20117 11.6797L5.97266 12.4551Z" />
    </Svg>
  );
};

export default ChartIcon;
