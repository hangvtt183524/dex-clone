import { ButtonMenu, ButtonMenuItem } from 'components/ButtonMenu';
import { ModalBody } from 'components/Modal/styles';
import { TokenList } from 'config/types/lists';
import { Token } from 'config/sdk-core';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import ManageLists from './ManageLists';
import ManageTokens from './ManageTokens';
import { CurrencyModalView } from './types';

const Manage = ({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) => {
  const [showLists, setShowLists] = useState(true);

  const { t } = useTranslation();

  return (
    <ModalBody height="100%">
      <ButtonMenu
        activeIndex={showLists ? 0 : 1}
        onItemClick={() => setShowLists((prev) => !prev)}
        scale="sm"
        mb="24px"
      >
        <ButtonMenuItem height={['32px', '38px']} width="50%">
          {t('Lists')}
        </ButtonMenuItem>
        <ButtonMenuItem height={['32px', '38px']} width="50%">
          {t('Tokens')}
        </ButtonMenuItem>
      </ButtonMenu>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </ModalBody>
  );
};
export default Manage;
