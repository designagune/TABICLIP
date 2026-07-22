'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {LoaderCircle} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {Button} from '@/components/ui/button';
import {FieldError} from '@/components/ui/field-error';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Modal} from '@/components/ui/modal';
import {Textarea} from '@/components/ui/textarea';
import type {CollectedItem} from '@/features/collection/types/collected-item';
import type {OrganizeCollectedItemInput} from '@/features/places/types/place';

import {organizePlaceSchema} from '../schemas/place-schema';

type PlaceFormValues = z.infer<typeof organizePlaceSchema>;

export function OrganizePlaceModal({
  item,
  tripId,
  pending,
  onClose,
  onSave
}: {
  item: CollectedItem | null;
  tripId: string;
  pending: boolean;
  onClose: () => void;
  onSave: (input: OrganizeCollectedItemInput) => Promise<void>;
}) {
  const t = useTranslations('places');
  const tc = useTranslations('common.actions');
  const form = useForm<PlaceFormValues>({
    resolver: zodResolver(organizePlaceSchema),
    values: {
      localName: '',
      translatedName: '',
      addressLocal: '',
      addressTranslated: '',
      region: '',
      category: 'sightseeing',
      memo: item?.memo ?? item?.originalText ?? '',
      googleMapUrl: ''
    }
  });

  const error = (key?: string) => {
    if (
      key === 'nameRequired' ||
      key === 'addressRequired' ||
      key === 'regionRequired'
    ) {
      return t(`validation.${key}`);
    }
    return undefined;
  };

  const submit = form.handleSubmit(async (values) => {
    if (!item) return;
    await onSave({
      tripId,
      collectedItemId: item.id,
      ...values,
      googleMapUrl: values.googleMapUrl || undefined
    });
    form.reset();
  });

  return (
    <Modal
      open={Boolean(item)}
      title={t('organizeTitle')}
      description={t('organizeDescription')}
      closeLabel={tc('close')}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {item ? (
          <div className="bg-muted rounded-xl p-3 text-xs leading-5 break-words">
            {item.originalText ?? item.memo ?? item.sourceUrl}
          </div>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="localName">{t('localName')}</Label>
            <Input
              id="localName"
              placeholder={t('localNamePlaceholder')}
              aria-invalid={Boolean(form.formState.errors.localName)}
              aria-describedby={
                form.formState.errors.localName ? 'local-name-error' : undefined
              }
              {...form.register('localName')}
            />
            <FieldError id="local-name-error">
              {error(form.formState.errors.localName?.message)}
            </FieldError>
          </div>
          <div>
            <Label htmlFor="translatedName">{t('translatedName')}</Label>
            <Input
              id="translatedName"
              placeholder={t('translatedNamePlaceholder')}
              {...form.register('translatedName')}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="addressLocal">{t('addressLocal')}</Label>
          <Input
            id="addressLocal"
            placeholder={t('addressLocalPlaceholder')}
            aria-invalid={Boolean(form.formState.errors.addressLocal)}
            aria-describedby={
              form.formState.errors.addressLocal
                ? 'address-local-error'
                : undefined
            }
            {...form.register('addressLocal')}
          />
          <FieldError id="address-local-error">
            {error(form.formState.errors.addressLocal?.message)}
          </FieldError>
        </div>
        <div>
          <Label htmlFor="addressTranslated">{t('addressTranslated')}</Label>
          <Input
            id="addressTranslated"
            placeholder={t('addressTranslatedPlaceholder')}
            {...form.register('addressTranslated')}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="region">{t('region')}</Label>
            <Input
              id="region"
              placeholder={t('regionPlaceholder')}
              {...form.register('region')}
            />
            <FieldError id="region-error">
              {error(form.formState.errors.region?.message)}
            </FieldError>
          </div>
          <div>
            <Label htmlFor="category">{t('category')}</Label>
            <select
              id="category"
              className="bg-card min-h-12 w-full rounded-xl border px-3 text-base"
              {...form.register('category')}
            >
              {(
                [
                  'sightseeing',
                  'food',
                  'cafe',
                  'shopping',
                  'stay',
                  'other'
                ] as const
              ).map((category) => (
                <option key={category} value={category}>
                  {t(`categories.${category}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="googleMapUrl">{t('mapUrl')}</Label>
          <Input
            id="googleMapUrl"
            inputMode="url"
            {...form.register('googleMapUrl')}
          />
        </div>
        <div>
          <Label htmlFor="placeMemo">{t('memo')}</Label>
          <Textarea
            id="placeMemo"
            placeholder={t('memoPlaceholder')}
            {...form.register('memo')}
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : null}
          {pending ? t('saving') : t('savePlace')}
        </Button>
      </form>
    </Modal>
  );
}
