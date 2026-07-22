import {
  ArrowRight,
  BookmarkPlus,
  CalendarDays,
  Compass,
  MapPin
} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {BrandMark} from '@/components/brand-mark';
import {LocaleSwitcher} from '@/components/locale-switcher';
import {buttonVariants} from '@/components/ui/button';
import {brand} from '@/config/brand';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';

export default async function LandingPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');

  const steps = [
    {
      icon: BookmarkPlus,
      title: t('landing.step1Title'),
      body: t('landing.step1Body')
    },
    {
      icon: MapPin,
      title: t('landing.step2Title'),
      body: t('landing.step2Body')
    },
    {
      icon: CalendarDays,
      title: t('landing.step3Title'),
      body: t('landing.step3Body')
    },
    {
      icon: Compass,
      title: t('landing.step4Title'),
      body: t('landing.step4Body')
    }
  ];

  return (
    <main id="main-content" className="min-h-dvh overflow-hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark />
        <LocaleSwitcher />
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-8 pb-20 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:pt-16">
        <div>
          <p className="text-primary mb-5 text-xs font-black tracking-[0.18em] uppercase">
            {t('landing.eyebrow')}
          </p>
          <h1 className="max-w-2xl text-[clamp(2.6rem,8vw,5.6rem)] leading-[1.04] font-black tracking-[-0.065em] text-balance">
            {t('landing.title')}
          </h1>
          <p className="text-muted-foreground mt-7 max-w-xl text-base leading-8 sm:text-lg">
            {t('landing.description')}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className={cn(buttonVariants({size: 'lg'}), 'group')}
            >
              {t('landing.primaryCta')}
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({variant: 'outline', size: 'lg'}))}
            >
              {t('landing.secondaryCta')}
            </Link>
          </div>
        </div>

        <div
          aria-label={t('landing.previewLabel')}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="bg-secondary absolute -inset-5 rotate-3 rounded-[3rem] opacity-95" />
          <div className="paper-grid bg-card relative overflow-hidden rounded-[2.5rem] border p-5 shadow-2xl sm:p-7">
            <div className="mb-10 flex items-center justify-between">
              <BrandMark compact />
              <span className="bg-foreground rounded-full px-3 py-1.5 text-xs font-black text-white">
                {t('landing.previewBadge')}
              </span>
            </div>
            <p className="text-muted-foreground text-xs font-black tracking-[0.16em] uppercase">
              {t('landing.previewLabel')}
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">
              {t('landing.previewPlace')}
            </h2>
            <div className="mt-7 grid grid-cols-[4.5rem_1fr] gap-4">
              <div className="bg-primary grid aspect-square place-items-center rounded-2xl text-white">
                <MapPin aria-hidden="true" className="size-8" />
              </div>
              <div className="border-l-2 pl-4">
                <p className="font-black">서울숲</p>
                <p className="text-muted-foreground mt-1 text-sm leading-6">
                  서울특별시 성동구 뚝섬로 273
                </p>
              </div>
            </div>
            <div className="bg-muted mt-7 flex items-center justify-between rounded-2xl px-4 py-4">
              <span className="text-sm font-bold">
                {t('landing.previewNext')}
              </span>
              <ArrowRight aria-hidden="true" className="size-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-white/55 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-xl text-3xl font-black tracking-[-0.045em] sm:text-4xl">
            {t('landing.flowTitle')}
          </h2>
          <div className="bg-border mt-10 grid gap-px overflow-hidden rounded-[2rem] border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="bg-card min-h-52 p-6">
                  <div className="flex items-center justify-between">
                    <Icon aria-hidden="true" className="text-primary size-6" />
                    <span className="text-muted-foreground text-xs font-black">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-10 text-xl font-black">{step.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {step.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between px-5 py-10 text-sm sm:px-8">
        <strong>{brand.name}</strong>
        <span className="text-muted-foreground">{t('brandTagline')}</span>
      </footer>
    </main>
  );
}
