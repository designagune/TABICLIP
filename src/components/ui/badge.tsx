import type {HTMLAttributes} from 'react';

import {cn} from '@/lib/utils';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'outline';

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: HTMLAttributes<HTMLSpanElement> & {tone?: BadgeTone}) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center rounded-full px-2.5 text-xs font-bold',
        tone === 'neutral' && 'bg-muted text-muted-foreground',
        tone === 'accent' && 'bg-primary/12 text-[#a54124]',
        tone === 'success' && 'bg-success/12 text-success',
        tone === 'outline' && 'text-foreground border bg-transparent',
        className
      )}
      {...props}
    />
  );
}
