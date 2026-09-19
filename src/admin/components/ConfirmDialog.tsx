import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}

export default function ConfirmDialog({ 
  open, 
  title, 
  message, 
  onCancel, 
  onConfirm,
  cancelText = "إلغاء",
  confirmText = "حذف"
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div 
        className="bg-neutral-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-md w-full text-white transform transition-all scale-100"
        dir="auto"
      >
        <div className="flex items-start gap-3.5 mb-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-neutral-100">{title}</h3>
            <p className="text-sm text-neutral-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-neutral-300 hover:bg-white/5 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}