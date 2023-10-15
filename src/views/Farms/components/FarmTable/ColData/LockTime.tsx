import { RowCenter } from 'components/Layout/Row';
import Skeleton from 'components/Skeleton';
import Text from 'components/Text';
import React, {useMemo} from 'react';
import { formatDisplayTime, getNow } from 'utils/dateHelper';
import { LockTimeProps } from '../../types';

const LockTime: React.FunctionComponent<React.PropsWithChildren<LockTimeProps>> = ({ lockTime }) => {
  const displayLockTime = useMemo(
        () => {
            const hour = Math.floor(lockTime / (60 * 60));
            const minute = Math.floor((lockTime - hour * 60 * 60) / 60);
            const second = lockTime - hour * 60 * 60 - minute * 60;
            return (hour ? `${hour}h` : '') + (minute ? `${minute}m` : '') + (second ? `${second}s` : '');
        },
        [lockTime],
  );

  return (
    <RowCenter>
      <Text fontSize={['12px', '', '', '', '', '14px']}>
        {lockTime === undefined ? '-' : displayLockTime}
      </Text>
    </RowCenter>
  );
};

export default LockTime;
