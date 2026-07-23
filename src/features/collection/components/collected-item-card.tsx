'use client';

import {FileText, Globe2, ImageIcon, MoveUpRight} from 'lucide-react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

import type {CollectedItem} from '../types/collected-item';

type ImageSize = {width: number; height: number};

function validImageSize(item: CollectedItem): ImageSize | null {
  return item.imageWidth && item.imageHeight
    ? {width: item.imageWidth, height: item.imageHeight}
    : null;
}

function CollectedItemImage({item}: {item: CollectedItem}) {
  const [size, setSize] = useState<ImageSize | null>(() =>
    validImageSize(item)
  );
  if (!item.imagePreviewUrl) return null;

  return (
    <div className="bg-muted mb-4 overflow-hidden rounded-2xl">
      <Image
        src={item.imagePreviewUrl}
        alt={item.originalText ?? item.memo ?? ''}
        width={size?.width ?? 1}
        height={size?.height ?? 1}
        sizes="(max-width: 640px) calc(100vw - 72px), 560px"
        className="block h-auto w-full"
        unoptimized
        onLoad={(event) => {
          if (size) return;
          const {naturalWidth, naturalHeight} = event.currentTarget;
          if (naturalWidth > 0 && naturalHeight > 0) {
            setSize({width: naturalWidth, height: naturalHeight});
          }
        }}
      />
    </div>
  );
}

export function CollectedItemCard({
  item,
  onOrganize
}: {
  item: CollectedItem;
  onOrganize: (item: CollectedItem) => void;
}) {
  const t = useTranslations('collection');
  const Icon =
    item.type === 'url' ? Globe2 : item.type === 'image' ? ImageIcon : FileText;
  const content = item.originalText ?? item.memo ?? item.sourceUrl ?? item.type;

  return (
    <article className="bg-card rounded-[1.5rem] border p-4 shadow-[0_8px_24px_rgb(32_37_31_/_5%)]">
      <CollectedItemImage item={item} />
      <div className="flex items-start gap-3">
        <span className="bg-muted grid size-11 shrink-0 place-items-center rounded-xl">
          <Icon aria-hidden="true" className="text-muted-foreground size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Badge tone={item.status === 'organized' ? 'success' : 'neutral'}>
              {item.status === 'organized' ? t('organized') : t('filterInbox')}
            </Badge>
            {item.sourcePlatform ? (
              <span className="text-muted-foreground truncate text-xs font-bold">
                {item.sourcePlatform}
              </span>
            ) : null}
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 font-medium break-words">
            {content}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-bold"
          >
            {t('sourceUrl')}
            <MoveUpRight aria-hidden="true" className="size-4" />
          </a>
        ) : null}
        {item.status !== 'organized' ? (
          <Button
            type="button"
            className="ml-auto"
            onClick={() => onOrganize(item)}
          >
            {t('organize')}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
