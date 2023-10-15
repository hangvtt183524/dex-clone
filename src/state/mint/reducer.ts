import { createReducer } from '@reduxjs/toolkit';
import { configMintState, FieldMint, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions';

export interface MintState {
  readonly independentField: FieldMint;
  readonly typedValue: string;
  readonly otherTypedValue: string;

  readonly [FieldMint.INPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly [FieldMint.OUTPUT]: {
    readonly currencyId: string | undefined;
  };
  readonly recipient: string | null;
}

const initialState: MintState = {
  independentField: FieldMint.INPUT,
  typedValue: '',
  otherTypedValue: '',
  recipient: null,

  [FieldMint.INPUT]: {
    currencyId: '',
  },
  [FieldMint.OUTPUT]: {
    currencyId: '',
  },
};

const mintReducer = createReducer<MintState>(initialState, (builder) =>
  builder
    .addCase(
      configMintState,
      (state, { payload: { typedValue, otherTypedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          ...state,
          [FieldMint.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [FieldMint.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue,
          otherTypedValue,
          recipient,
        };
      },
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === FieldMint.INPUT ? FieldMint.OUTPUT : FieldMint.INPUT;

      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === FieldMint.INPUT ? FieldMint.OUTPUT : FieldMint.INPUT,
          [field]: { currencyId },
          [otherField]: { currenPcyId: state[field].currencyId },
        };
      }
      // the normal case
      return {
        ...state,
        [field]: { currencyId },
      };
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField: state.independentField === FieldMint.INPUT ? FieldMint.OUTPUT : FieldMint.INPUT,
        [FieldMint.INPUT]: { currencyId: state[FieldMint.OUTPUT].currencyId },
        [FieldMint.OUTPUT]: { currencyId: state[FieldMint.INPUT].currencyId },
      };
    })
    .addCase(typeInput, (state, { payload: { field, typedValue, noLiquidity } }) => {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          };
        }
        // they're typing into a new field, store the other value

        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: state.typedValue,
        };
      }
      return {
        ...state,
        independentField: field,
        typedValue,
        otherTypedValue: '',
      };
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient;
    }),
);
export default mintReducer;
