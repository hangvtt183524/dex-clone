import React, { useCallback, useState } from 'react';

import { Card } from 'components/Card';
import { InjectedModalProps } from 'components/Modal';
import {
  ModalBackButton,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
} from 'components/Modal/styles';
import { Currency, Token } from 'config/sdk-core';
import { TokenList } from 'config/types/lists';
import usePreviousValue from 'hooks/usePreviousValue';
import { useTranslation } from 'react-i18next';
import CurrencySearch from './CurrencySearch';
import ImportList from './ImportList';
import ImportToken from './ImportToken';
import Manage from './Manage';
import { CurrencyModalView } from './types';

export interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null;
  handleCurrencySelect: (token: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  commonBasesType?: string;
}

const CurrencySearchModal: React.FC<CurrencySearchModalProps> = ({
  onDismiss = () => null,
  handleCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = true,
  commonBasesType,
}) => {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search);

  const handleCurrencySelectState = useCallback(
    (currency: Currency) => {
      if (onDismiss) onDismiss();
      if (handleCurrencySelect) handleCurrencySelect(currency);
    },
    [onDismiss, handleCurrencySelect],
  );

  // for token import view
  const prevView = usePreviousValue(modalView);

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>();

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>();
  const [listURL, setListUrl] = useState<string | undefined>();

  const { t } = useTranslation();

  const config = {
    [CurrencyModalView.search]: {
      title: t('Select a Token'),
      onBack: undefined,
    },
    [CurrencyModalView.manage]: {
      title: t('Manage Tokens'),
      onBack: () => setModalView(CurrencyModalView.search),
    },
    [CurrencyModalView.importToken]: {
      title: t('Import Tokens'),
      onBack: () =>
        setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search),
    },
    [CurrencyModalView.importList]: {
      title: t('Import List'),
      onBack: () => setModalView(CurrencyModalView.search),
    },
  };
  const { onBack } = config[modalView];

  return (
    <ModalContainer width="100%" maxWidth="500px">
      <Card p="0 !important" variant="modal">
        <Card
          variant="modal"
          pb="0 !important"
          radius="0"
          style={{
            minHeight: '500px',
            maxHeight: '600px',
            height: '100%',
          }}
        >
          <ModalHeader mb={['4px', '', '', '', '8px']} justifyContent="space-between">
            {onBack ? <ModalBackButton onBack={onBack} /> : <div />}
            <ModalTitle ml={onBack ? '12px' : ''} scale="md" width="100%">
              {config[modalView].title}
            </ModalTitle>
            {onDismiss && <ModalCloseButton onDismiss={onDismiss} />}
          </ModalHeader>
          <ModalBody style={{ overflow: 'unset', flex: 1 }}>
            {modalView === CurrencyModalView.search ? (
              <CurrencySearch
                handleCurrencySelect={handleCurrencySelectState}
                selectedCurrency={selectedCurrency}
                otherSelectedCurrency={otherSelectedCurrency}
                showCommonBases={showCommonBases}
                commonBasesType={commonBasesType}
                showImportView={() => setModalView(CurrencyModalView.importToken)}
                setImportToken={setImportToken}
              />
            ) : modalView === CurrencyModalView.importToken && importToken ? (
              <ImportToken tokens={[importToken]} handleCurrencySelect={handleCurrencySelectState} />
            ) : modalView === CurrencyModalView.importList && importList && listURL ? (
              <ImportList list={importList} listURL={listURL} onImport={() => setModalView(CurrencyModalView.manage)} />
            ) : modalView === CurrencyModalView.manage ? (
              <Manage
                setModalView={setModalView}
                setImportToken={setImportToken}
                setImportList={setImportList}
                setListUrl={setListUrl}
              />
            ) : (
              ''
            )}
          </ModalBody>
        </Card>

        {/* {modalView === CurrencyModalView.search && ( TODO
          <WrapButtonManageToken>
            <IconButton
              width="100%"
              scale="sm"
              onClick={() => setModalView(CurrencyModalView.manage)}
              className="list-token-manage-button"
            >
              <Text scale="md" fontWeight={700} gradient={RoboTheme.colors.gradients.primary}>
                {t('Manage Tokens')}
              </Text>
            </IconButton>
          </WrapButtonManageToken>
        )} */}
      </Card>
    </ModalContainer>
  );
};

export default CurrencySearchModal;
