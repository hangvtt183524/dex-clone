import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { setBlock } from './actions';

interface BlockState {
  currentBlock: number;
  initialBlock: number;
}
const initialState: BlockState = { currentBlock: 0, initialBlock: 0 };

const blockReducer = createReducer<BlockState>(initialState, (builder) =>
  builder.addCase(setBlock, (state, action: PayloadAction<number>) => {
    if (state.initialBlock === 0) {
      state.initialBlock = action.payload;
    }

    state.currentBlock = action.payload;

    return state;
  }),
);

export default blockReducer;
