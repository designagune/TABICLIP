'use client';

import {
  CalendarDays,
  Home,
  MapPinned,
  Navigation,
  Paperclip
} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';

export function BottomNavigation({tripId}: {tripId: string}) {
  const t = useTranslations('common.nav');
  const pathname = usePathname();
  const base = `/app/trips/${tripId}`;
  const items = [
    {href: base, label: t('home'), icon: Home, exact: true},
    {href: `${base}/inbox`, label: t('inbox'), icon: Paperclip},
    {href: `${base}/places`, label: t('places'), icon: MapPinned},
    {href: `${base}/schedule`, label: t('schedule'), icon: CalendarDays},
    {href: `${base}/today`, label: t('today'), icon: Navigation}
  ];

  return (
    <nav
      aria-label={t('home')}
      className="safe-bottom bg-card/96 fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-3xl border-t px-2 pt-2 shadow-[0_-12px_40px_rgb(32_37_31_/_8%)] backdrop-blur-xl"
    >
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[0.66rem] font-bold transition',
              active
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active ? (
              <span className="bg-primary absolute top-0 h-0.5 w-6 rounded-full" />
            ) : null}
            <Icon aria-hidden="true" className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
