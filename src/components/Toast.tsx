'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const getStyle = () => {
    switch (toastMessage.type) {
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200';
      case 'warn':
        return 'bg-amber-950/90 border-amber-500/50 text-amber-200';
      case 'error':
        return 'bg-rose-950/90 border-rose-500/50 text-rose-200';
      default:
        return 'bg-calm-900/90 border-brand-500/40 text-calm-100';
    }
  };

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warn':
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-brand-400 shrink-0" />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-auto animate-in slide-in-from-bottom-3 duration-200"
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-elevated text-xs font-medium ${getStyle()}`}
      >
        {getIcon()}
        <span className="flex-1">{toastMessage.text}</span>
      </div>
    </div>
  );
};
