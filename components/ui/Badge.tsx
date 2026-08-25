import { ReactNode } from 'react';

export default function Badge({
  children,
  variant = 'blue'
}: {
  children: ReactNode;
  variant?: 'blue' | 'green' | 'orange' | 'slate';
}) {
  const styles = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    orange: 'bg-orange-50 text-orange-700 ring-orange-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
