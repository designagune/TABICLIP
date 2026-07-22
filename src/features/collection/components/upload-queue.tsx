'use client';

import {
  CheckCircle2,
  ImageIcon,
  LoaderCircle,
  TriangleAlert
} from 'lucide-react';
import {useTranslations} from 'next-intl';

import type {UploadQueueItem} from '../stores/upload-queue-store';

export function UploadQueue({items}: {items: UploadQueueItem[]}) {
  const t = useTranslations('collection.upload');
  if (items.length === 0) return null;

  return (
    <ul aria-label={t('waiting')} className="mt-4 space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="bg-card flex items-center gap-3 rounded-xl border p-3"
        >
          {item.status === 'uploading' ? (
            <LoaderCircle
              aria-hidden="true"
              className="text-primary size-5 animate-spin"
            />
          ) : item.status === 'complete' ? (
            <CheckCircle2 aria-hidden="true" className="text-success size-5" />
          ) : item.status === 'failed' ? (
            <TriangleAlert aria-hidden="true" className="text-danger size-5" />
          ) : (
            <ImageIcon
              aria-hidden="true"
              className="text-muted-foreground size-5"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{item.name}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {item.status === 'uploading'
                ? t('uploading', {progress: item.progress})
                : t(item.status)}
            </p>
          </div>
          <div
            role="progressbar"
            aria-valuenow={item.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="bg-muted h-1.5 w-14 overflow-hidden rounded-full"
          >
            <div
              className="bg-primary h-full"
              style={{width: `${item.progress}%`}}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
