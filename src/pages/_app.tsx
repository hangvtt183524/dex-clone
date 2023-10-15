import { NextPage } from 'next';
import Script from 'next/script';
import type { AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, useStore } from 'state/store';
import 'i18n';
import ResetCSS from 'styles/resetCSS';
import GlobalStyle from 'styles/global';
import Layout from 'components/Layout';
import Providers from 'views/Providers';
import { usePollBlockNumber } from 'state/block/hooks';
// import { useWhitelistAccount } from 'hooks/useWhitelistAccount';

type AppProps<P = any> = Omit<NextAppProps<P>, 'pageProps'> & {
  pageProps: P;
};
const Hooks = () => {
  usePollBlockNumber();
  // useWhitelistAccount();
  return null;
};
const AppComponent = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <Layout {...(pageProps.layoutProps || {})}>
      <Component {...pageProps} />
    </Layout>
  );
};

const DEFAULT_META = {
  title: 'RoboEx - The Next Evolution Defi Exchange Built For The Community',
  description: 'RoboEx aims to become the cheapest and fastest DEX built for the community',
  image: '/assets/images/image-preview.png',
};

const RoboDexApp = (props: AppProps) => {
  const { pageProps } = props;
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover, user-scalable=no;user-scalable=0"
        />
        <meta httpEquiv="content-language" content="en" />

        <meta name="twitter:title" content={DEFAULT_META.title} />
        <meta name="twitter:description" content={DEFAULT_META.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={DEFAULT_META.image} />

        <meta property="og:title" content={DEFAULT_META.title} />
        <meta property="og:description" content={DEFAULT_META.description} />
        <meta property="og:image" content={DEFAULT_META.image} />
        <meta name="description" content={DEFAULT_META.description} />

        <title>RoboEx</title>
      </Head>
      <Providers store={store}>
        <GlobalStyle />
        <Hooks />
        <ResetCSS />
        <PersistGate loading={null} persistor={persistor}>
          <AppComponent {...props} />
        </PersistGate>
      </Providers>

      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
      <Script
         dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
            `,
         }}
      />
    </>
  );
};

type NextPageWithLayout = NextPage & {
  Layout?: React.FC;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default RoboDexApp;
