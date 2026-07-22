'use client';

import {ArrowLeft, Database, ShieldCheck} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {BrandMark} from '@/components/brand-mark';
import {LocaleSwitcher} from '@/components/locale-switcher';
import {Badge} from '@/components/ui/badge';
import {InstallGuide} from '@/features/pwa/components/install-guide';
import {Link} from '@/i18n/navigation';
import {getDataMode} from '@/lib/data-mode';

export function SettingsScreen() {
  const t = useTranslations('common.settings');
  const tc = useTranslations('common.actions');
  const mode = getDataMode();
  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-white/28">
      <header className="flex min-h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="hover:bg-muted grid size-11 place-items-center rounded-xl"
            aria-label={tc('back')}
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </Link>
          <BrandMark compact />
        </div>
        <LocaleSwitcher />
      </header>
      <main id="main-content" className="space-y-5 px-5 py-8 sm:px-8">
        <h1 className="text-3xl font-black tracking-[-0.05em]">{t('title')}</h1>
        <section className="bg-card rounded-[1.5rem] border p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-black">
              <Database aria-hidden="true" className="text-primary size-5" />
              {t('dataMode')}
            </span>
            <Badge tone="outline">{mode}</Badge>
          </div>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            {mode === 'mock' ? t('mockDescription') : t('supabaseDescription')}
          </p>
        </section>
        <InstallGuide />
        <section className="bg-card rounded-[1.5rem] border p-5">
          <ShieldCheck aria-hidden="true" className="text-success size-6" />
          <p className="mt-3 text-sm leading-6 font-bold">{t('privacy')}</p>
        </section>
      </main>
    </div>
  );
}
