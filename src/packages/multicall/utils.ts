import { CallOverrides } from '@ethersproject/contracts';
import { createMulticall } from '.';

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean;
}
const { multicall, multicallv2 } = createMulticall();

export { multicall, multicallv2 };
