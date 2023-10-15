/* eslint-disable max-len */
import { RowCenter, RowFixed } from 'components/Layout/Row';
import Skeleton from 'components/Skeleton';
import Text from 'components/Text';
import useTooltip from 'hooks/useTooltip';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { HelpIcon } from 'svgs';
import { MultiplierProps } from '../../types';

const Multiplier: React.FunctionComponent<React.PropsWithChildren<MultiplierProps>> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />;
  const { t } = useTranslation();
  const tooltipContent = (
    <>
      <Text>
        {t(
          'The Multiplier represents the proportion of CAKE rewards each farm receives, as a proportion of the CAKE produced each block.',
        )}
      </Text>
      <Text my="24px">
        {t('For example, if a 1x farm received 1 CAKE per block, a 40x farm would receive 40 CAKE per block.')}
      </Text>
      <Text>{t('This amount is already included in all APR calculations for the farm.')}</Text>
    </>
  );
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  });

  return (
    <RowCenter>
      <Text mr="8px" color="text">
        {displayMultiplier}
      </Text>
      <RowFixed ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </RowFixed>
      {tooltipVisible && tooltip}
    </RowCenter>
  );
};

export default Multiplier;
