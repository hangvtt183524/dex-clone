import React, { useMemo } from 'react';
import useModal from '../../hooks/useModal';
// eslint-disable-next-line import/no-cycle
import WarningNetworkModal from './index';

const useWarningNetworkModal = () => {
    const [onPresentWarningNetworkModal, onDismissWarningNetworkModal] = useModal(<WarningNetworkModal />, {
        modalId: 'warning-modal',
        closeOnOverlayClick: false,
    });

    return useMemo(
        () => ({
            onPresentWarningNetworkModal,
            onDismissWarningNetworkModal,
        }),
        [onPresentWarningNetworkModal, onDismissWarningNetworkModal],
    );
}

export default useWarningNetworkModal;