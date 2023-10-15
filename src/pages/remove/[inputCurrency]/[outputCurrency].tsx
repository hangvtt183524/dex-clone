import RemoveLiquidity from 'views/Liquidity/RemoveLiquidity';

export async function getStaticProps() {
  return {
    props: {
      layoutProps: {
        backgroundOpacity: 0.5,
        backgroundImage: 'background.png',
      },
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default RemoveLiquidity;
