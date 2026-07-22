import {createStore} from 'zustand/vanilla';
import {create} from 'zustand';

export type UploadStatus = 'waiting' | 'uploading' | 'complete' | 'failed';

export interface UploadQueueItem {
  id: string;
  name: string;
  progress: number;
  status: UploadStatus;
}

interface UploadQueueState {
  items: UploadQueueItem[];
  enqueue: (item: Pick<UploadQueueItem, 'id' | 'name'>) => void;
  update: (
    id: string,
    update: Partial<Pick<UploadQueueItem, 'progress' | 'status'>>
  ) => void;
  remove: (id: string) => void;
  reset: () => void;
}

const initialState = {items: [] as UploadQueueItem[]};

export function createUploadQueueStore() {
  return createStore<UploadQueueState>()((set) => ({
    ...initialState,
    enqueue: (item) =>
      set((state) => ({
        items: [...state.items, {...item, progress: 0, status: 'waiting'}]
      })),
    update: (id, update) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? {...item, ...update} : item
        )
      })),
    remove: (id) =>
      set((state) => ({items: state.items.filter((item) => item.id !== id)})),
    reset: () => set(initialState)
  }));
}

export const useUploadQueueStore = create<UploadQueueState>((set) => ({
  ...initialState,
  enqueue: (item) =>
    set((state) => ({
      items: [...state.items, {...item, progress: 0, status: 'waiting'}]
    })),
  update: (id, update) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? {...item, ...update} : item
      )
    })),
  remove: (id) =>
    set((state) => ({items: state.items.filter((item) => item.id !== id)})),
  reset: () => set(initialState)
}));
