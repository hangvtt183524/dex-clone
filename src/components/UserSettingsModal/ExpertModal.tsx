/* eslint-disable max-len */
import { Flex } from 'components/Box';
import Button from 'components/Button';
import { Checkbox } from 'components/Checkbox';
import { Message } from 'components/Message';
import Modal, { InjectedModalProps } from 'components/Modal';
import Text from 'components/Text';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useExpertModeManager } from 'state/user/hooks';

interface ExpertModalProps extends InjectedModalProps {
  setShowConfirmExpertModal: (boolean) => void;
  setShowExpertModeAcknowledgement: (boolean) => void;
}

const ExpertModal: React.FC<React.PropsWithChildren<ExpertModalProps>> = ({
  setShowConfirmExpertModal,
  setShowExpertModeAcknowledgement,
}) => {
  const [, toggleExpertMode] = useExpertModeManager();
  const [isRememberChecked, setIsRememberChecked] = useState(false);
  const { isMobile } = useMatchBreakpoints();

  const { t } = useTranslation();

  return (
    <Modal
      title={t('Expert Mode')}
      onBack={() => setShowConfirmExpertModal(false)}
      onDismiss={() => setShowConfirmExpertModal(false)}
      style={{ width: isMobile ? '100%' : '436px' }}
    >
      <Message variant="warning" mb="24px">
        <Text>
          {t(
            // eslint-disable-next-line quotes, @typescript-eslint/quotes
            "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
          )}
        </Text>
      </Message>
      <Text mb="24px">{t('Only use this mode if you know what you’re doing.')}</Text>
      <Flex alignItems="center" mb="24px">
        <Checkbox
          name="confirmed"
          type="checkbox"
          checked={isRememberChecked}
          onChange={() => setIsRememberChecked(!isRememberChecked)}
          scale="sm"
        />
        <Text
          onClick={() => setIsRememberChecked(!isRememberChecked)}
          ml="10px"
          color="textSubtle"
          style={{ userSelect: 'none' }}
        >
          {t('Don’t show this again')}
        </Text>
      </Flex>
      <Button
        mb="8px"
        id="confirm-expert-mode"
        onClick={() => {
          // eslint-disable-next-line no-alert
          if (window.prompt('Please type the word "confirm" to enable expert mode.') === 'confirm') {
            toggleExpertMode();
            setShowConfirmExpertModal(false);
            if (isRememberChecked) {
              setShowExpertModeAcknowledgement(false);
            }
          }
        }}
      >
        {t('Turn On Expert Mode')}
      </Button>
      <Button
        variant="disabled"
        onClick={() => {
          setShowConfirmExpertModal(false);
        }}
      >
        {t('Cancel')}
      </Button>
    </Modal>
  );
};

export default ExpertModal;
