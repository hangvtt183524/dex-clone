import Image from 'components/Image';
import { AutoColumn } from 'components/Layout/Column';
import { RowCenter } from 'components/Layout/Row';
import { NextLinkFromReactRouter } from 'components/Link/NextLink';
import Text from 'components/Text';
import { urlRoute } from 'config/endpoints';
import React from 'react';
import RoboTheme from 'styles';

const EmptyPool = () => {
  return (
    <RowCenter height="100%" width="100%" m="auto">
      <AutoColumn gap="16px" justify="center" m="auto" maxWidth="300px">
        <Image src="/assets/images/empty-liquidity.png" width={103} height={112} alt="image empty liquidity" />
        <AutoColumn gap="8px">
          <Text scale="md" fontWeight={600} color="textSubtle" textAlign="center" lineHeight="24px">
            No liquidity found
          </Text>
          <Text fontWeight={400} color="textSubtle" textAlign="center" style={{ display: 'inline-flex' }}>
            Don&apos;t see a pool you joined?
            <Text
              as={NextLinkFromReactRouter}
              href={urlRoute.findPool().to}
              fontWeight={600}
              ml="4px"
              gradient={RoboTheme.colors.gradients.primary}
            >
              Import pool.
            </Text>
          </Text>
        </AutoColumn>
      </AutoColumn>
    </RowCenter>
  );
};

export default EmptyPool;
