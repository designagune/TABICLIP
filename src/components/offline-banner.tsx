'use client';

import {CloudOff} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {platformService} from '@/shared/platform/browser-platform-service';
import {useNetworkStatus} from '@/shared/platform/use-network-status';

export function OfflineBanner() {
  const t = useTranslations('common.states');
  const online = useNetworkStatus(platformService);

  if (online) return null;

  return (
    <div
      role="status"
      className="bg-danger px-4 py-2.5 text-center text-sm font-bold text-white"
    >
      <span className="inline-flex items-center gap-2">
        <CloudOff aria-hidden="true" className="size-4" />
        {t('offline')}
      </span>
    </div>
  );
}
