'use client';

import {LoaderCircle} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Modal} from '@/components/ui/modal';
import {Textarea} from '@/components/ui/textarea';
import type {TripPlace} from '@/features/places/types/place';
import {enumerateDates} from '@/shared/date/date-utils';

export function AddToItineraryModal({
  place,
  tripDates,
  pending,
  onClose,
  onSave
}: {
  place: TripPlace | null;
  tripDates: {start: string; end: string};
  pending: boolean;
  onClose: () => void;
  onSave: (input: {
    tripPlaceId: string;
    date: string;
    startTime: string;
    memo: string;
  }) => Promise<void>;
}) {
  const t = useTranslations('itinerary');
  const tc = useTranslations('common.actions');
  const dates = enumerateDates(tripDates.start, tripDates.end);
  const [date, setDate] = useState(dates[0] ?? '');
  const [startTime, setStartTime] = useState('10:00');
  const [memo, setMemo] = useState('');

  return (
    <Modal
      open={Boolean(place)}
      title={
        place?.place.translatedName || place?.place.localName || t('title')
      }
      description={t('description')}
      closeLabel={tc('close')}
      onClose={onClose}
    >
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (place) {
            const selectedDate = dates.includes(date) ? date : (dates[0] ?? '');
            void onSave({
              tripPlaceId: place.id,
              date: selectedDate,
              startTime,
              memo
            });
          }
        }}
      >
        <div>
          <Label htmlFor="itinerary-date">{t('date')}</Label>
          <select
            id="itinerary-date"
            className="bg-card min-h-12 w-full rounded-xl border px-3 text-base"
            value={dates.includes(date) ? date : (dates[0] ?? '')}
            onChange={(event) => setDate(event.target.value)}
          >
            {dates.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="itinerary-time">{t('startTime')}</Label>
          <Input
            id="itinerary-time"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="itinerary-memo">{t('memo')}</Label>
          <Textarea
            id="itinerary-memo"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : null}
          {t('add')}
        </Button>
      </form>
    </Modal>
  );
}
