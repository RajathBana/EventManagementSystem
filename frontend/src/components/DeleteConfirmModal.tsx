import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { EventItem } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  event,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Delete Event?</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-800">"{event.title}"</strong>?
            This will permanently remove the event and all associated attendee registrations.
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {loading ? 'Deleting...' : 'Yes, Delete Event'}
          </button>
        </div>
      </div>
    </div>
  );
};
