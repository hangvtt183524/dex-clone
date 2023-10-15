import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Store } from '@reduxjs/toolkit';
import RoboTheme from 'styles';
import ContextProvider from 'contexts/ContextProvider';
import { WagmiProvider } from 'packages/wagmi/src';
import { client } from 'packages/wagmi/src/wagmi';
import { Updaters } from './Updaterts';

const Providers: React.FC<{ store: Store; children: React.ReactNode }> = ({ children, store }) => (
  <WagmiProvider client={client}>
    <Provider store={store}>
      <ThemeProvider theme={RoboTheme}>
        <ContextProvider>
          {children}
          <Updaters />
        </ContextProvider>
      </ThemeProvider>
    </Provider>
  </WagmiProvider>
);

export default Providers;
