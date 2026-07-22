import type {TextareaHTMLAttributes} from 'react';

import {cn} from '@/lib/utils';

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'bg-card placeholder:text-muted-foreground/70 min-h-28 w-full resize-y rounded-xl border px-3.5 py-3 text-base shadow-sm transition',
        'focus:border-primary focus:ring-primary/20 focus:ring-4 focus:outline-none',
        className
      )}
      {...props}
    />
  );
}
