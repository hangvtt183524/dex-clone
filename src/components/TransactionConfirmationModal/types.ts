import { Currency } from 'config/sdk-core';
import { ReactNode } from 'react';

export interface ConfirmationModalProps {
  title: string;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => ReactNode;
  attemptingTxn: boolean;
  pendingText: ReactNode;
  currencyToAdd?: Currency | undefined;
}
