import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
}

export function DeleteConfirm({ isOpen, onClose, onConfirm, title, description }: DeleteConfirmProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Delete "{title}"?</h3>
        <p className="text-muted-foreground mb-6">
          {description || "This action cannot be undone. This will permanently delete the item."}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="flex-1 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
