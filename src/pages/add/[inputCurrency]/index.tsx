import AddLiquidity from 'views/Liquidity/AddLiquidity';

export async function getStaticProps() {
  return {
    props: {
      layoutProps: {
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

export default AddLiquidity;
