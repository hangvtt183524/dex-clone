import Trending from 'views/Trending';

export async function getStaticProps() {
  return {
    props: {
      layoutProps: {
        backgroundImage: 'farms/background.png',
        backgroundOpacity: 0.5,
      },
    },
  };
}

export default Trending;
