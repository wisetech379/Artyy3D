import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  children?: React.ReactNode;
}

export default function StatCard({ title, value, children }: StatCardProps) {
  return (
    <div className="bg-neutral-900/70 border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-sm flex items-center justify-between transition-all hover:border-orange-500/30">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-wider text-neutral-400 truncate">{title}</div>
        <div className="text-xl sm:text-2xl font-bold text-white mt-1 truncate">{value}</div>
      </div>
      {children && (
        <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0 ml-3">
          {children}
        </div>
      )}
    </div>
  );
}