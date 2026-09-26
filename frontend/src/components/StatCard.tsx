import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  variant?: 'default' | 'success' | 'brand';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  variant = 'default',
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
      case 'brand':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="card-surface p-5 flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
        </p>
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtext}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl border ${getBadgeColors()}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
