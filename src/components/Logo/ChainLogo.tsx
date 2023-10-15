import React, { memo } from 'react';
import { HelpIcon } from 'svgs';
import Image from 'components/Image';
import { isSupportedChain } from 'config/constants/chains';
import RoboTheme from 'styles';

export const ChainLogo = memo(({ chainId }: { chainId: number }) => {
  if (isSupportedChain(chainId)) {
    return (
      <Image
        src={`/assets/images/chains/${chainId}.png`}
        width={24}
        height={24}
        unoptimized
        alt={`chain-${chainId}`}
        style={{
          borderRadius: '50%',
        }}
      />
    );
  }

  return <HelpIcon width={24} height={24} fill={RoboTheme.colors.textSubtle} />;
});
