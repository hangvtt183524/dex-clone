import { createGlobalStyle } from 'styled-components';
import { Colors, RoboTheme } from './types';

declare module 'styled-components' {
  export interface DefaultTheme extends RoboTheme {
    colors: Colors;
  }
}

const GlobalStyle = createGlobalStyle`;
  * {
    font-family: 'Poppins';
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    font-style: normal;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
  }

  html{

  }
  
  body {
    width: 100vw;
    min-height: 100vh;
    overflow: overlay;

    background: #0D0E10;

    img {
      height: auto;
      max-width: 100%;
    }

    
    &.no-scroll {
      overflow: hidden;
    }
  }

  #currency-list > div {
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.textSubtle}
    }
    &::-webkit-scrollbar-track {
      background: transparent
    }
    &::-webkit-scrollbar {
      background: transparent
    }
  }
`;

export default GlobalStyle;
