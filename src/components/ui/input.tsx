import type {InputHTMLAttributes} from 'react';

import {cn} from '@/lib/utils';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'bg-card placeholder:text-muted-foreground/70 min-h-12 w-full rounded-xl border px-3.5 text-base shadow-sm transition disabled:opacity-60',
        'focus:border-primary focus:ring-primary/20 focus:ring-4 focus:outline-none',
        className
      )}
      {...props}
    />
  );
}
