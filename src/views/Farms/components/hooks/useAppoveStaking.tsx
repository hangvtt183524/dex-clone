import { ApprovalState } from 'hooks/useApproval';
import { useApproveStakeCallback } from 'hooks/useApproveCallback';
import { useState, useEffect, useMemo, useCallback } from 'react';

export const useApproveStaking = (managerAddress: string, pid: number, amount: string) => {
  const [approvalState, approve] = useApproveStakeCallback(managerAddress, pid, amount);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(approvalState === ApprovalState.APPROVED);

  const isApprovePending = approvalPending || approvalState === ApprovalState.PENDING;
  const showApproveFlow =
    approvalState === ApprovalState.NOT_APPROVED ||
    isApprovePending ||
    (approvalSubmitted && approvalState !== ApprovalState.APPROVED) ||
    approvalState !== ApprovalState.APPROVED;

  const approveTokenButtonDisabled =
    approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted || isApprovePending;

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  const handleApprove = useCallback(async () => {
    setApprovalPending(true);
    try {
      await approve()
        .then(() => {
          setApprovalPending(false);
        })
        .catch(() => {
          setApprovalPending(false);
        });
    } catch (e) {
      setApprovalPending(false);
    }
  }, [approve]);

  return useMemo(
    () => ({
      isApprovePending,
      showApproveFlow,
      approveTokenButtonDisabled,
      handleApprove,
    }),
    [isApprovePending, showApproveFlow, approveTokenButtonDisabled, handleApprove],
  );
};
