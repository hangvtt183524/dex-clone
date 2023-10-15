import { createReducer } from '@reduxjs/toolkit';

import { FieldBurn, typeInput } from './actions';

interface BurnState {
  readonly independentField: FieldBurn;
  readonly typedValue: string;
}

const initialState: BurnState = {
  independentField: FieldBurn.LIQUIDITY_PERCENT,
  typedValue: '0',
};

const burnReducer = createReducer<BurnState>(initialState, (builder) =>
  builder.addCase(typeInput, (state, { payload: { field, typedValue } }) => {
    return {
      ...state,
      independentField: field,
      typedValue,
    };
  }),
);
export default burnReducer;
