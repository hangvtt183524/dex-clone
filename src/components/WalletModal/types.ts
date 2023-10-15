import React from 'react';

export type Login<T> = (connectorId: T) => void;

// eslint-disable-next-line @typescript-eslint/ban-types
export interface WalletConfig<T = {}> {
  title: string;
  icon: React.ReactNode;
  connectorId: T;
  priority: number | (() => number);
  href?: string;
  installed?: boolean;
  downloadLink?: {
    desktop?: string;
    mobile?: string;
  };
}
