import Image from 'components/Image';
import { AutoColumn } from 'components/Layout/Column';
import { RowCenter, RowFixed } from 'components/Layout/Row';
import { Message, MessageText } from 'components/Message';
import Modal, { InjectedModalProps } from 'components/Modal';
import Text from 'components/Text';
import React from 'react';
import UserNetwork from 'components/Layout/components/UserNetwork';

const WarningNetworkModal: React.FC<InjectedModalProps> = ({ onDismiss } = {}) => {
  return (
    <Modal maxWidth={['100%', '450px']} closeButton={false} title="Check your network">
      <AutoColumn gap="24px">
        <Text color="textAlt2">Currently this page not support your selected network.</Text>
        <RowCenter>
          <Image alt="network" src="/assets/images/network.png" width={280} height={180} />
        </RowCenter>
        <Message variant="warning">
          <RowFixed>
            <MessageText>Please switch your network to continue.</MessageText>
          </RowFixed>
        </Message>

        <UserNetwork width='99%' showNetworkInMobile />
      </AutoColumn>
    </Modal>
  );
};

export default WarningNetworkModal;


// const ValidateNetwork = () => {
//   const { isConnected } = useAccount();
//   const { chainId, isWrongNetwork } = useActiveWeb3React();
//
//   const [onPresent, onDismiss] = useModal(WarningNetworkModal, {
//     modalId: 'warning-modal',
//     closeOnOverlayClick: false,
//   });
//
//   const debounceCallback = useDebounceCallback();
//   const { refreshBlockNumber } = useRefreshBlockNumber();
//
//   useEffect(() => {
//     if (isConnected) {
//       refreshBlockNumber();
//       debounceCallback(() => {
//         if (!chainId || isWrongNetwork) {
//           onPresent();
//         } else {
//           onDismiss();
//         }
//       }, 1000);
//     }
//   }, [chainId, isWrongNetwork, isConnected, refreshBlockNumber, debounceCallback, onPresent, onDismiss]);
//   return <></>;
// };

// export default React.memo(ValidateNetwork);
