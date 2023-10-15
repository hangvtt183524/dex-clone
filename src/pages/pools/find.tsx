import PoolFinder from 'views/PoolFinder';

export async function getStaticProps() {
  return {
    props: {
      layoutProps: {
        backgroundImage: 'background.png',
        backgroundOpacity: 0.5,
      },
    },
  };
}
export default PoolFinder;
