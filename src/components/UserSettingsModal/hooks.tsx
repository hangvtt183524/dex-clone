import useModal from 'hooks/useModal';
import React, { useMemo } from 'react';
import UserSettingsModal from './UserSettingsModal';

export const useUserSettingsModal = () => {
  const [onPressentUserSettingsModal, onDismissUserSettingsModal] = useModal(<UserSettingsModal />, {
    modalId: 'user-setting-modal',
  });

  return useMemo(
    () => ({
      onPressentUserSettingsModal,
      onDismissUserSettingsModal,
    }),
    [onPressentUserSettingsModal, onDismissUserSettingsModal],
  );
};
