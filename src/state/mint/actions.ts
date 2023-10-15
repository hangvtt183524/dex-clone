import { createAction } from '@reduxjs/toolkit';

export enum FieldMint {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export const selectCurrency = createAction<{
  field: FieldMint;
  currencyId: string;
}>('mint/selectCurrency');
export const switchCurrencies = createAction<void>('mint/switchCurrencies');

export const typeInput = createAction<{
  field: FieldMint;
  typedValue: string;
  noLiquidity: boolean;
}>('mint/typeInput');

export const configMintState = createAction<{
  field: FieldMint;
  typedValue: string;
  otherTypedValue: string;
  inputCurrencyId?: string;
  outputCurrencyId?: string;
  recipient: string | null;
}>('mint/configMintState');

export const setRecipient = createAction<{ recipient: string | null }>('mint/setRecipient');
