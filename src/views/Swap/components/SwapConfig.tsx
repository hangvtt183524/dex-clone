import React from 'react';
import { useDefaultsFromURLSearch } from 'state/tokens/hooks';

const SwapConfig = () => {
  useDefaultsFromURLSearch();

  return null;
};

export default React.memo(SwapConfig);
