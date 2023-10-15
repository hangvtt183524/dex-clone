/* eslint-disable max-len */
import { RowCenter } from 'components/Layout/Row';
import Skeleton from 'components/Skeleton';
import Text from 'components/Text';
import React from 'react';
import { FeeProps } from '../../types';

const Fee: React.FunctionComponent<React.PropsWithChildren<FeeProps>> = ({ fee }) => {
  const displayMultiplier = fee ? `${fee || 0}%` : <Skeleton width={30} />;
  return (
    <RowCenter>
      <Text color="text">{displayMultiplier}</Text>
    </RowCenter>
  );
};

export default Fee;
