'use client';

import {ArrowLeft, CheckCircle2, Mail} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useState} from 'react';

import {BrandMark} from '@/components/brand-mark';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Link, useRouter} from '@/i18n/navigation';
import {getDataMode} from '@/lib/data-mode';

import {requestMagicLink} from '../services/auth-service';

export function LoginScreen() {
  const t = useTranslations('common.login');
  const tc = useTranslations('common.actions');
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t('invalidEmail'));
      return;
    }
    setPending(true);
    setError('');
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
      await requestMagicLink({
        email,
        redirectTo: `${appUrl}/${locale}/auth/callback?next=/${locale}/app`
      });
      setSent(true);
    } catch {
      setError(t('failed'));
    } finally {
      setPending(false);
    }
  }

  return (
    <main
      id="main-content"
      className="mx-auto min-h-dvh max-w-lg px-5 py-6 sm:py-12"
    >
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="hover:bg-muted grid size-11 place-items-center rounded-xl"
          aria-label={tc('back')}
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <BrandMark compact />
      </div>

      <section className="bg-card mt-12 rounded-[2rem] border p-6 shadow-xl sm:p-8">
        {sent ? (
          <div className="py-8 text-center" role="status">
            <CheckCircle2
              aria-hidden="true"
              className="text-success mx-auto size-12"
            />
            <h1 className="mt-5 text-2xl font-black">{t('sentTitle')}</h1>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              {t('sentBody')}
            </p>
          </div>
        ) : (
          <>
            <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-2xl">
              <Mail aria-hidden="true" className="size-6" />
            </span>
            <h1 className="mt-6 text-3xl font-black tracking-[-0.05em]">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {t('description')}
            </p>
            <form onSubmit={submit} className="mt-7" noValidate>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-error' : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
              {error ? (
                <p
                  id="login-error"
                  role="alert"
                  className="text-danger mt-2 text-sm font-bold"
                >
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                size="lg"
                className="mt-4 w-full"
                disabled={pending}
              >
                {t('submit')}
              </Button>
            </form>
          </>
        )}
      </section>

      {getDataMode() === 'mock' ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-4 w-full"
          onClick={() => router.push('/app')}
        >
          {t('mock')}
        </Button>
      ) : null}
    </main>
  );
}
