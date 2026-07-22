'use client';

import {useMemo, useState} from 'react';
import {toast} from 'sonner';

import {platformService} from '@/shared/platform/browser-platform-service';

import {
  useAddCollectedItem,
  useOrganizeCollectedItem,
  useTripWorkspace
} from '@/features/trips/queries/use-trip-queries';
import {validateImage} from '../schemas/collection-schema';
import {useUploadQueueStore} from '../stores/upload-queue-store';
import type {CollectedItem} from '../types/collected-item';

type ComposerTab = 'url' | 'image' | 'text';
type CollectionFilter = 'all' | 'inbox' | 'organized';

export function useCollectionViewModel(tripId: string) {
  const query = useTripWorkspace(tripId);
  const addMutation = useAddCollectedItem(tripId);
  const organizeMutation = useOrganizeCollectedItem(tripId);
  const [tab, setTab] = useState<ComposerTab>('url');
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [selectedItem, setSelectedItem] = useState<CollectedItem | null>(null);
  const queue = useUploadQueueStore((state) => state.items);
  const enqueue = useUploadQueueStore((state) => state.enqueue);
  const updateUpload = useUploadQueueStore((state) => state.update);

  const items = useMemo(() => {
    const source = query.data?.collectedItems ?? [];
    return filter === 'all'
      ? source
      : source.filter((item) => item.status === filter);
  }, [filter, query.data?.collectedItems]);

  async function addUrl(invalidMessage: string, failureMessage: string) {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol))
        throw new Error('INVALID_URL');
      await addMutation.mutateAsync({tripId, type: 'url', sourceUrl: url});
      setUrl('');
    } catch {
      toast.error(url ? invalidMessage : failureMessage);
    }
  }

  async function addText(requiredMessage: string, failureMessage: string) {
    if (!text.trim()) {
      toast.error(requiredMessage);
      return;
    }
    try {
      await addMutation.mutateAsync({
        tripId,
        type: 'text',
        originalText: text.trim()
      });
      setText('');
    } catch {
      toast.error(failureMessage);
    }
  }

  async function selectImages(
    errorText: (key: 'fileType' | 'fileSize' | 'saveFailed') => string
  ) {
    const images = await platformService.selectImages();
    for (const selected of images) {
      const validationError = validateImage(selected.file);
      if (validationError) {
        toast.error(errorText(validationError));
        continue;
      }
      const uploadId = crypto.randomUUID();
      enqueue({id: uploadId, name: selected.file.name});
      updateUpload(uploadId, {status: 'uploading', progress: 45});
      try {
        await addMutation.mutateAsync({
          tripId,
          type: 'image',
          image: selected.file
        });
        updateUpload(uploadId, {status: 'complete', progress: 100});
      } catch {
        updateUpload(uploadId, {status: 'failed', progress: 0});
        toast.error(errorText('saveFailed'));
      }
    }
  }

  return {
    query,
    items,
    tab,
    setTab,
    filter,
    setFilter,
    url,
    setUrl,
    text,
    setText,
    queue,
    addPending: addMutation.isPending,
    addUrl,
    addText,
    selectImages,
    selectedItem,
    selectItem: setSelectedItem,
    closeOrganizer: () => setSelectedItem(null),
    organizeMutation
  };
}
