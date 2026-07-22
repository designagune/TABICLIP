import type {Preview} from '@storybook/nextjs-vite';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NextIntlClientProvider} from 'next-intl';

import collection from '../src/messages/ja/collection.json';
import common from '../src/messages/ja/common.json';
import itinerary from '../src/messages/ja/itinerary.json';
import places from '../src/messages/ja/places.json';
import reservations from '../src/messages/ja/reservations.json';
import trips from '../src/messages/ja/trips.json';

import '../src/app/globals.css';

const messages = {common, trips, collection, places, itinerary, reservations};

const preview: Preview = {
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {queries: {retry: false}}
      });
      return (
        <NextIntlClientProvider
          locale="ja"
          messages={messages}
          timeZone="Asia/Seoul"
        >
          <QueryClientProvider client={queryClient}>
            <div className="mx-auto max-w-lg p-4">
              <Story />
            </div>
          </QueryClientProvider>
        </NextIntlClientProvider>
      );
    }
  ],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {pathname: '/app/trips/demo-trip'}
    },
    viewport: {defaultViewport: 'mobile1'},
    a11y: {test: 'error'},
    backgrounds: {default: 'paper'}
  },
  tags: ['autodocs']
};

export default preview;
