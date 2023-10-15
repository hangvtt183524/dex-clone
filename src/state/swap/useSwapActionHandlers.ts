import { Token } from 'config/sdk-core';
import { useCallback } from 'react';
import { useAppDispatch } from 'state/store';
import { Field, selectCurrency, switchCurrencies, typeInput, setRecipient } from 'state/swap/actions';

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Token) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeRecipient: (recipient: string | null) => void;
} {
  const dispatch = useAppDispatch();

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onCurrencySelection = useCallback(
    (field: Field, currency: Token) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency?.isNative ? currency.symbol : currency.address,
        }),
      );
    },
    [dispatch],
  );

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
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
