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

export default AddLiquidity;
