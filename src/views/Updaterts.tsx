import React from 'react';
import ListsUpdater from 'state/lists/updater';
import MulticallUpdater from 'state/multicall/updater';
import TransactionUpdater from 'state/transactions/updater';

export const Updaters = () => {
  return (
    <>
      <ListsUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
};
