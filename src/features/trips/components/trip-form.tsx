'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {ArrowLeft, LoaderCircle} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';

import {BrandMark} from '@/components/brand-mark';
import {Button} from '@/components/ui/button';
import {FieldError} from '@/components/ui/field-error';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Link, useRouter} from '@/i18n/navigation';
import {addDays, toIsoDate} from '@/shared/date/date-utils';

import {useCreateTrip} from '../queries/use-trip-queries';
import {createTripSchema} from '../schemas/trip-schema';

type TripFormValues = z.infer<typeof createTripSchema>;

function translatedError(
  key: string | undefined,
  translate: (
    key: 'titleRequired' | 'countryRequired' | 'dateRequired' | 'dateOrder'
  ) => string
) {
  if (
    key === 'titleRequired' ||
    key === 'countryRequired' ||
    key === 'dateRequired' ||
    key === 'dateOrder'
  ) {
    return translate(key);
  }
  return undefined;
}

export function TripForm() {
  const t = useTranslations('trips');
  const tc = useTranslations('common.actions');
  const router = useRouter();
  const mutation = useCreateTrip();
  const today = new Date();
  const form = useForm<TripFormValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: '',
      originCountryCode: 'JP',
      destinationCountryCode: 'KR',
      language: 'ja',
      startDate: toIsoDate(addDays(today, 14)),
      endDate: toIsoDate(addDays(today, 17))
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const trip = await mutation.mutateAsync(values);
      router.push(`/app/trips/${trip.id}`);
    } catch {
      toast.error(t('validation.titleRequired'));
    }
  });

  const errorText = (key?: string) =>
    translatedError(key, (messageKey) => t(`validation.${messageKey}`));

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-white/28">
      <header className="flex min-h-16 items-center gap-2 border-b px-4">
        <Link
          href="/app"
          className="hover:bg-muted grid size-11 place-items-center rounded-xl"
          aria-label={tc('back')}
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <BrandMark compact />
      </header>
      <main id="main-content" className="px-5 py-8 sm:px-8">
        <p className="text-primary text-xs font-black tracking-[0.18em] uppercase">
          {t('form.eyebrow')}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">
          {t('form.title')}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {t('form.description')}
        </p>

        <form onSubmit={onSubmit} className="mt-9 space-y-6" noValidate>
          <div>
            <Label htmlFor="title">{t('form.name')}</Label>
            <Input
              id="title"
              placeholder={t('form.namePlaceholder')}
              aria-invalid={Boolean(form.formState.errors.title)}
              aria-describedby={
                form.formState.errors.title ? 'title-error' : undefined
              }
              {...form.register('title')}
            />
            <FieldError id="title-error">
              {errorText(form.formState.errors.title?.message)}
            </FieldError>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origin">{t('form.origin')}</Label>
              <select
                id="origin"
                className="bg-card min-h-12 w-full rounded-xl border px-3 text-base"
                {...form.register('originCountryCode')}
              >
                <option value="JP">{t('countries.JP')}</option>
                <option value="KR">{t('countries.KR')}</option>
              </select>
            </div>
            <div>
              <Label htmlFor="destination">{t('form.destination')}</Label>
              <select
                id="destination"
                className="bg-card min-h-12 w-full rounded-xl border px-3 text-base"
                {...form.register('destinationCountryCode')}
              >
                <option value="KR">{t('countries.KR')}</option>
                <option value="JP">{t('countries.JP')}</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="language">{t('form.language')}</Label>
            <select
              id="language"
              className="bg-card min-h-12 w-full rounded-xl border px-3 text-base"
              {...form.register('language')}
            >
              <option value="ja">{t('languages.ja')}</option>
              <option value="ko">{t('languages.ko')}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">{t('form.startDate')}</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register('startDate')}
              />
            </div>
            <div>
              <Label htmlFor="endDate">{t('form.endDate')}</Label>
              <Input
                id="endDate"
                type="date"
                aria-invalid={Boolean(form.formState.errors.endDate)}
                aria-describedby={
                  form.formState.errors.endDate ? 'end-date-error' : undefined
                }
                {...form.register('endDate')}
              />
              <FieldError id="end-date-error">
                {errorText(form.formState.errors.endDate?.message)}
              </FieldError>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-5 animate-spin"
              />
            ) : null}
            {mutation.isPending ? t('form.saving') : t('form.submit')}
          </Button>
        </form>
      </main>
    </div>
  );
}
