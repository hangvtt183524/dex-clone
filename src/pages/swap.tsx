import Swap from 'views/Swap';

export async function getStaticProps() {
  return {
    props: {
      layoutProps: {
        backgroundImage: 'background.png',
        backgroundOpacity: 0.8,
        padding: '0 !important',
        maxWidth: '100vw !important',
      },
    },
  };
}

export default Swap;
