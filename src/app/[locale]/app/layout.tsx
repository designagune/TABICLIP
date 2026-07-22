import type {ReactNode} from 'react';

import {redirect} from '@/i18n/navigation';
import {getDataMode} from '@/lib/data-mode';
import {createClient} from '@/lib/supabase/server';

export default async function AuthenticatedAppLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (getDataMode() === 'supabase') {
    const {data} = await (await createClient()).auth.getClaims();
    if (!data?.claims) redirect({href: '/login', locale});
  }
  return children;
}
