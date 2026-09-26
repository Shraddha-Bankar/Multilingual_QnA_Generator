import React from 'react';
import { CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';
import type { StageStatus } from '../types';

interface StatusBadgeProps {
  status: StageStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <CheckCircle2 className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600 dark:text-emerald-400`} />
          <span>{label || 'Completed'}</span>
        </span>
      );

    case 'in_progress':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Loader2 className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} animate-spin text-blue-600 dark:text-blue-400`} />
          <span>{label || 'In Progress'}</span>
        </span>
      );

    case 'failed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <AlertCircle className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-rose-600 dark:text-rose-400`} />
          <span>{label || 'Failed'}</span>
        </span>
      );

    case 'pending':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Clock className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-400`} />
          <span>{label || 'Pending'}</span>
        </span>
      );
  }
};
