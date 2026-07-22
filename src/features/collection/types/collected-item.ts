export type CollectedItemType = 'image' | 'url' | 'text';
export type CollectedItemStatus = 'inbox' | 'organizing' | 'organized';

export interface CollectedItem {
  id: string;
  tripId: string;
  type: CollectedItemType;
  sourceUrl: string | null;
  sourcePlatform: string | null;
  originalText: string | null;
  memo: string | null;
  imagePreviewUrl: string | null;
  status: CollectedItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AddCollectedItemInput {
  tripId: string;
  type: CollectedItemType;
  sourceUrl?: string;
  originalText?: string;
  memo?: string;
  image?: File;
}
