'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export interface EndSessionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function EndSessionModal({
  open,
  onClose,
  onConfirm,
  isPending,
}: EndSessionModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="End session?"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Ending…
              </>
            ) : (
              'End session'
            )}
          </Button>
        </>
      }
    >
      An evaluation will be generated from this conversation. You can view it
      after ending.
    </Modal>
  );
}
