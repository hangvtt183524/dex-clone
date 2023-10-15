import { Currency } from 'config/sdk-core';
import { useCallback } from 'react';
import { useAppDispatch } from 'state/store';
import { FieldMint, selectCurrency, switchCurrencies, typeInput, setRecipient } from 'state/mint/actions';

export function useMintActionHandlers(): {
  onCurrencySelection: (field: FieldMint, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: FieldMint, typedValue: string) => void;
  onChangeRecipient: (recipient: string | null) => void;
} {
  const dispatch = useAppDispatch();

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onCurrencySelection = useCallback(
    (field: FieldMint, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency?.isNative ? currency.symbol : currency.wrapped.address,
        }),
      );
    },
    [dispatch],
  );

  const onUserInput = useCallback(
    (field: FieldMint, typedValue: string) => {
      dispatch(typeInput({ field, typedValue, noLiquidity: true }));
    },
    [dispatch],
  );

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }));
    },
    [dispatch],
  );

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  };
}
