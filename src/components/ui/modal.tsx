'use client';

import {X} from 'lucide-react';
import {useEffect, type ReactNode} from 'react';

import {Button} from './button';

export function Modal({
  open,
  title,
  description,
  closeLabel,
  onClose,
  children
}: {
  open: boolean;
  title: string;
  description?: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/35 p-0 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-6"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        className="bg-background safe-bottom max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] p-5 shadow-2xl sm:max-w-xl sm:rounded-[2rem] sm:p-7"
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-xl font-black tracking-tight">
              {title}
            </h2>
            {description ? (
              <p
                id="modal-description"
                className="text-muted-foreground mt-1 text-sm leading-6"
              >
                {description}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </Button>
        </header>
        {children}
      </section>
    </div>
  );
}
