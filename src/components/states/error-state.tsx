'use client';

import {AlertTriangle} from 'lucide-react';

import {Button} from '@/components/ui/button';

export function ErrorState({
  title,
  retryLabel,
  onRetry
}: {
  title: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <section
      role="alert"
      className="bg-card rounded-[1.75rem] border px-6 py-10 text-center"
    >
      <AlertTriangle
        aria-hidden="true"
        className="text-danger mx-auto size-8"
      />
      <h2 className="mt-4 text-lg font-black">{title}</h2>
      <Button
        type="button"
        variant="outline"
        className="mt-6"
        onClick={onRetry}
      >
        {retryLabel}
      </Button>
    </section>
  );
}
