import JSBI from 'jsbi';

export const formatGasPrice = (userGasPrice: number | string, ethGasPrice: JSBI) =>
  JSBI.multiply(ethGasPrice, JSBI.BigInt(userGasPrice));
