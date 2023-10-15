import Image from 'components/Image';
import { ColumnCenter } from 'components/Layout/Column';
import Text from 'components/Text';
import React from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';

const ErrorPage: React.FC = () => {
  return (
    <Wrapper>
      <Image src="/assets/images/404.png" width={650} height={400} alt="image 404" />
      <Text fontSize="50px">Oops!</Text>
      <Text textAlign="center" fontSize="16px" mt="16px" color="textSubtle">
        Unauthorized Access. You must have made a wrong turn somewhere.
      </Text>
    </Wrapper>
  );
};

const Wrapper = styled(ColumnCenter)`
  flex: 1 1;
  justify-content: center;
`;

export async function getStaticProps() {
  return {
    props: {
      layoutProps: {
        background: RoboTheme.colors.background,
        maxWidth: '100vw !important',
      },
    },
  };
}

export default ErrorPage;
