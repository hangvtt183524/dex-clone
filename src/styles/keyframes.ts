import { keyframes } from 'styled-components';

export const themeKeyframes = {
  loading: keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `,
};
