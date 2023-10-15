import Earn from 'views/Earn';

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

export default Earn;
