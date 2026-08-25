import { ReactNode } from 'react';

export default function Card({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
