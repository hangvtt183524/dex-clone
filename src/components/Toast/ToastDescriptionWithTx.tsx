import Link from 'components/Link';
import Text from 'components/Text';
import { SupportedChainId } from 'config/sdk-core';

import { truncateHash } from 'utils/addressHelpers';
import { getExploreName, getExplorerLink } from 'utils/getExplorer';
import React from 'react';
import { useTranslation } from 'react-i18next';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';

interface ToastTxnProps {
  description?: string;
  txHash?: string;
  txChainId?: SupportedChainId;
}

const ToastTxn: React.FC<React.PropsWithChildren<ToastTxnProps>> = ({ txHash, txChainId, children }) => {
  const { chainId } = useActiveWeb3React();

  const { t } = useTranslation();

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={getExplorerLink(txHash, 'transaction', txChainId || chainId)}>
          {t('View on {{site}}', {
            site: getExploreName(chainId),
          })}
          : {truncateHash(txHash, 8, 0)}
        </Link>
      )}
    </>
  );
};

export default ToastTxn;
