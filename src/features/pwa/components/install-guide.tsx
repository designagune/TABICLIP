'use client';

import {Share, Smartphone} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

import {Button} from '@/components/ui/button';

export function InstallGuide() {
  const t = useTranslations('common.install');
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <aside className="bg-secondary rounded-[1.5rem] p-5 text-white">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
          <Smartphone aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="font-black">{t('title')}</h2>
          <p className="mt-1 text-sm leading-6 text-white/70">{t('body')}</p>
          <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold">
            <Share aria-hidden="true" className="size-4" /> {t('browser')}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
        onClick={() => setVisible(false)}
      >
        {t('dismiss')}
      </Button>
    </aside>
  );
}
