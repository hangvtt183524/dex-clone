import { AutoColumn } from 'components/Layout/Column';
import React from 'react';
import RoboTheme from 'styles';
import { PoolTableProps } from './types';
import PoolRowMobile from './PoolRowMobile';

const PoolTableMobile: React.FC<PoolTableProps> = ({ pairs, stakingInfosWithBalance }) => {
  return (
    <AutoColumn
      style={{
        borderRadius: RoboTheme.radius.medium,
      }}
      gap="16px"
      width="100%"
    >
      <AutoColumn gap="16px">
        {pairs.map(
          (stakingPair, i) =>
            stakingPair && ( // skip pairs that arent loaded
              <PoolRowMobile
                key={stakingInfosWithBalance?.[i]?.stakingRewardAddress}
                pair={stakingPair}
                stakedBalance={stakingInfosWithBalance?.[i]?.stakedAmount}
              />
            ),
        )}
      </AutoColumn>
    </AutoColumn>
  );
};

export default PoolTableMobile;
