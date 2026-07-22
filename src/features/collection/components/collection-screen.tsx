'use client';

import {FileText, ImagePlus, Inbox, Link2} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {toast} from 'sonner';

import {PageHeading} from '@/components/page-heading';
import {EmptyState} from '@/components/states/empty-state';
import {ErrorState} from '@/components/states/error-state';
import {ScreenSkeleton} from '@/components/states/screen-skeleton';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';
import {OrganizePlaceModal} from '@/features/places/components/organize-place-modal';

import {useCollectionViewModel} from '../view-models/use-collection-view-model';
import {CollectedItemCard} from './collected-item-card';
import {UploadQueue} from './upload-queue';

export function CollectionScreen({tripId}: {tripId: string}) {
  const t = useTranslations('collection');
  const tc = useTranslations('common.actions');
  const vm = useCollectionViewModel(tripId);

  if (vm.query.isPending) return <ScreenSkeleton />;
  if (vm.query.isError) {
    return (
      <ErrorState
        title={t('errors.saveFailed')}
        retryLabel={tc('retry')}
        onRetry={() => void vm.query.refetch()}
      />
    );
  }

  const tabs = [
    {id: 'url' as const, label: t('tabs.url'), icon: Link2},
    {id: 'image' as const, label: t('tabs.image'), icon: ImagePlus},
    {id: 'text' as const, label: t('tabs.text'), icon: FileText}
  ];
  const filters = [
    {id: 'all' as const, label: t('filterAll')},
    {id: 'inbox' as const, label: t('filterInbox')},
    {id: 'organized' as const, label: t('filterOrganized')}
  ];

  return (
    <div>
      <PageHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />

      <section className="bg-card rounded-[1.75rem] border p-4 shadow-sm sm:p-5">
        <div
          role="tablist"
          className="bg-muted grid grid-cols-3 rounded-xl p-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = vm.tab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={cn(
                  'flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold transition',
                  selected ? 'bg-card shadow-sm' : 'text-muted-foreground'
                )}
                onClick={() => vm.setTab(tab.id)}
              >
                <Icon aria-hidden="true" className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {vm.tab === 'url' ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void vm.addUrl(t('errors.invalidUrl'), t('errors.saveFailed'));
              }}
            >
              <Label htmlFor="clip-url">{t('urlLabel')}</Label>
              <Input
                id="clip-url"
                type="url"
                inputMode="url"
                value={vm.url}
                placeholder={t('urlPlaceholder')}
                onChange={(event) => vm.setUrl(event.target.value)}
              />
              <Button
                type="submit"
                className="mt-3 w-full"
                disabled={vm.addPending}
              >
                {vm.addPending ? t('adding') : t('addUrl')}
              </Button>
            </form>
          ) : null}
          {vm.tab === 'text' ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void vm.addText(
                  t('errors.textRequired'),
                  t('errors.saveFailed')
                );
              }}
            >
              <Label htmlFor="clip-text">{t('textLabel')}</Label>
              <Textarea
                id="clip-text"
                value={vm.text}
                placeholder={t('textPlaceholder')}
                onChange={(event) => vm.setText(event.target.value)}
              />
              <Button
                type="submit"
                className="mt-3 w-full"
                disabled={vm.addPending}
              >
                {vm.addPending ? t('adding') : t('addText')}
              </Button>
            </form>
          ) : null}
          {vm.tab === 'image' ? (
            <div>
              <Label>{t('imageLabel')}</Label>
              <button
                type="button"
                className="hover:border-primary hover:bg-primary/5 flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 transition"
                onClick={() =>
                  void vm.selectImages((key) => t(`errors.${key}`))
                }
              >
                <ImagePlus aria-hidden="true" className="text-primary size-7" />
                <span className="mt-3 font-bold">{t('addImage')}</span>
                <span className="text-muted-foreground mt-1 text-xs">
                  {t('imageHelp')}
                </span>
              </button>
              <UploadQueue items={vm.queue} />
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={vm.filter === filter.id}
            className={cn(
              'min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold',
              vm.filter === filter.id ? 'bg-foreground text-white' : 'bg-card'
            )}
            onClick={() => vm.setFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {vm.items.map((item) => (
          <CollectedItemCard
            key={item.id}
            item={item}
            onOrganize={vm.selectItem}
          />
        ))}
      </div>
      {vm.items.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            icon={Inbox}
            title={t('emptyTitle')}
            description={t('emptyBody')}
          />
        </div>
      ) : null}

      <OrganizePlaceModal
        item={vm.selectedItem}
        tripId={tripId}
        pending={vm.organizeMutation.isPending}
        onClose={vm.closeOrganizer}
        onSave={async (input) => {
          try {
            await vm.organizeMutation.mutateAsync(input);
            vm.closeOrganizer();
            toast.success(t('organized'));
          } catch {
            toast.error(t('errors.saveFailed'));
          }
        }}
      />
    </div>
  );
}
