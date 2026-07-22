import {describe, expect, it} from 'vitest';

import {createUploadQueueStore} from './upload-queue-store';

describe('upload queue store', () => {
  it('moves an upload through the workflow and resets', () => {
    const store = createUploadQueueStore();
    expect(store.getState().items).toEqual([]);
    store.getState().enqueue({id: '1', name: 'seoul.png'});
    expect(store.getState().items[0]).toMatchObject({
      status: 'waiting',
      progress: 0
    });
    store.getState().update('1', {status: 'uploading', progress: 40});
    expect(store.getState().items[0]).toMatchObject({
      status: 'uploading',
      progress: 40
    });
    store.getState().update('1', {status: 'complete', progress: 100});
    expect(store.getState().items[0]?.status).toBe('complete');
    store.getState().reset();
    expect(store.getState().items).toEqual([]);
  });

  it('removes one upload without touching others', () => {
    const store = createUploadQueueStore();
    store.getState().enqueue({id: '1', name: 'one.png'});
    store.getState().enqueue({id: '2', name: 'two.png'});
    store.getState().remove('1');
    expect(store.getState().items.map((item) => item.id)).toEqual(['2']);
  });
});
