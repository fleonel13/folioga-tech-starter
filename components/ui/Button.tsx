import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  href?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

const styles = {
  primary:
    'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5',
  secondary:
    'bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800 hover:-translate-y-0.5',
  outline:
    'border border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100'
};

export default function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  onClick
}: Props) {
  const classes =
    `inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
