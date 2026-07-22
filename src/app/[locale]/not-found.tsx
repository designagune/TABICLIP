import {MapPinOff} from 'lucide-react';
import {getTranslations} from 'next-intl/server';

import {EmptyState} from '@/components/states/empty-state';
import {buttonVariants} from '@/components/ui/button';
import {Link} from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('common');
  return (
    <main
      id="main-content"
      className="mx-auto grid min-h-dvh max-w-lg place-items-center px-5"
    >
      <EmptyState
        icon={MapPinOff}
        title={t('states.error')}
        description={t('states.empty')}
        action={
          <Link href="/" className={buttonVariants()}>
            {t('actions.back')}
          </Link>
        }
      />
    </main>
  );
}
