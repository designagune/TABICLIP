import type {SupabaseClient} from '@supabase/supabase-js';

import {
  mapCollectedItem,
  mapItineraryItem,
  mapPlace,
  mapReservation,
  mapTrip,
  mapTripPlace
} from '@/features/trips/mappers/trip-mappers';
import type {Database} from '@/lib/supabase/database.types';

import type {CreateTripInput} from '../types/trip';
import type {TripWorkspaceRepository} from './trip-workspace-repository';

type Client = SupabaseClient<Database>;
const SIGNED_IMAGE_URL_TTL_SECONDS = 10 * 60;
type CollectionImagePreview = {
  url: string;
  width: number | null;
  height: number | null;
};

function requireData<T>(data: T | null, error: {message: string} | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error('SUPABASE_EMPTY_RESPONSE');
  return data;
}

async function requireUserId(client: Client): Promise<string> {
  const {data, error} = await client.auth.getUser();
  if (error || !data.user) throw new Error('AUTH_REQUIRED');
  return data.user.id;
}

function sourcePlatform(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

async function createCollectionPreviewUrls(
  client: Client,
  attachments: Array<{
    collected_item_id: string | null;
    storage_path: string;
    width: number | null;
    height: number | null;
  }>
): Promise<Map<string, CollectionImagePreview>> {
  const entries = await Promise.all(
    attachments.flatMap((attachment) => {
      const collectedItemId = attachment.collected_item_id;
      return collectedItemId
        ? [
            (async () => {
              const {data, error} = await client.storage
                .from('trip-private')
                .createSignedUrl(
                  attachment.storage_path,
                  SIGNED_IMAGE_URL_TTL_SECONDS
                );
              if (error) throw new Error(error.message);
              return [
                collectedItemId,
                {
                  url: data.signedUrl,
                  width: attachment.width,
                  height: attachment.height
                }
              ] as const;
            })()
          ]
        : [];
    })
  );
  return new Map(entries);
}

async function readImageDimensions(
  file: File
): Promise<{width: number; height: number}> {
  const bitmap = await createImageBitmap(file);
  try {
    return {width: bitmap.width, height: bitmap.height};
  } finally {
    bitmap.close();
  }
}

export function createSupabaseTripWorkspaceRepository(
  client: Client
): TripWorkspaceRepository {
  return {
    async listTrips() {
      const response = await client
        .from('trips')
        .select('*')
        .order('start_date');
      if (response.error) throw new Error(response.error.message);
      return response.data.map(mapTrip);
    },

    async createTrip(input: CreateTripInput) {
      const ownerId = await requireUserId(client);
      const response = await client
        .from('trips')
        .insert({
          owner_id: ownerId,
          title: input.title,
          origin_country_code: input.originCountryCode,
          destination_country_code: input.destinationCountryCode,
          language: input.language,
          start_date: input.startDate,
          end_date: input.endDate
        })
        .select()
        .single();
      return mapTrip(requireData(response.data, response.error));
    },

    async getWorkspace(tripId: string) {
      const [
        tripResult,
        collectionResult,
        attachmentResult,
        tripPlacesResult,
        itineraryResult,
        reservationResult
      ] = await Promise.all([
        client.from('trips').select('*').eq('id', tripId).single(),
        client
          .from('collected_items')
          .select('*')
          .eq('trip_id', tripId)
          .order('created_at', {ascending: false}),
        client
          .from('attachments')
          .select('collected_item_id, storage_path, width, height')
          .eq('trip_id', tripId)
          .not('collected_item_id', 'is', null),
        client.from('trip_places').select('*').eq('trip_id', tripId),
        client
          .from('itinerary_items')
          .select('*')
          .eq('trip_id', tripId)
          .order('date')
          .order('sort_order'),
        client
          .from('reservations')
          .select('*')
          .eq('trip_id', tripId)
          .order('reservation_date')
      ]);

      const trip = mapTrip(requireData(tripResult.data, tripResult.error));
      if (collectionResult.error)
        throw new Error(collectionResult.error.message);
      if (attachmentResult.error)
        throw new Error(attachmentResult.error.message);
      if (tripPlacesResult.error)
        throw new Error(tripPlacesResult.error.message);
      if (itineraryResult.error) throw new Error(itineraryResult.error.message);
      if (reservationResult.error)
        throw new Error(reservationResult.error.message);

      const imagePreviewUrls = await createCollectionPreviewUrls(
        client,
        attachmentResult.data
      );

      const placeIds = tripPlacesResult.data.map((row) => row.place_id);
      const placesResult = placeIds.length
        ? await client.from('places').select('*').in('id', placeIds)
        : {data: [], error: null};
      if (placesResult.error) throw new Error(placesResult.error.message);
      const placesById = new Map(
        placesResult.data.map((row) => [row.id, mapPlace(row)])
      );
      const tripPlaces = tripPlacesResult.data.flatMap((row) => {
        const place = placesById.get(row.place_id);
        return place ? [mapTripPlace(row, place)] : [];
      });
      const tripPlacesById = new Map(tripPlaces.map((item) => [item.id, item]));

      return {
        trip,
        collectedItems: collectionResult.data.map((row) =>
          mapCollectedItem(row, imagePreviewUrls.get(row.id) ?? null)
        ),
        places: tripPlaces,
        itineraryItems: itineraryResult.data.map((row) =>
          mapItineraryItem(
            row,
            row.trip_place_id
              ? tripPlacesById.get(row.trip_place_id)
              : undefined
          )
        ),
        reservations: reservationResult.data.map(mapReservation)
      };
    },

    async addCollectedItem(input) {
      const ownerId = await requireUserId(client);
      const imageDimensions = input.image
        ? await readImageDimensions(input.image)
        : null;
      const response = await client
        .from('collected_items')
        .insert({
          trip_id: input.tripId,
          type: input.type,
          source_url: input.sourceUrl ?? null,
          source_platform: sourcePlatform(input.sourceUrl),
          original_text: input.originalText ?? null,
          memo: input.memo ?? null
        })
        .select()
        .single();
      const row = requireData(response.data, response.error);

      if (input.image) {
        const extension =
          input.image.type === 'image/png'
            ? 'png'
            : input.image.type === 'image/webp'
              ? 'webp'
              : 'jpg';
        const attachmentId = crypto.randomUUID();
        const storagePath = `users/${ownerId}/trips/${input.tripId}/collection/${attachmentId}.${extension}`;
        const upload = await client.storage
          .from('trip-private')
          .upload(storagePath, input.image, {
            contentType: input.image.type,
            upsert: false
          });
        if (upload.error) {
          await client.from('collected_items').delete().eq('id', row.id);
          throw new Error(upload.error.message);
        }
        const attachment = await client.from('attachments').insert({
          id: attachmentId,
          trip_id: input.tripId,
          collected_item_id: row.id,
          storage_path: storagePath,
          mime_type: input.image.type,
          file_size: input.image.size,
          width: imageDimensions?.width ?? null,
          height: imageDimensions?.height ?? null
        });
        if (attachment.error) {
          await client.storage.from('trip-private').remove([storagePath]);
          await client.from('collected_items').delete().eq('id', row.id);
          throw new Error(attachment.error.message);
        }
      }

      return mapCollectedItem(
        row,
        imageDimensions
          ? {
              url: null,
              width: imageDimensions.width,
              height: imageDimensions.height
            }
          : null
      );
    },

    async organizeCollectedItem(input) {
      const userId = await requireUserId(client);
      const tripResult = await client
        .from('trips')
        .select('destination_country_code')
        .eq('id', input.tripId)
        .single();
      const trip = requireData(tripResult.data, tripResult.error);
      const placeResult = await client
        .from('places')
        .insert({
          created_by: userId,
          visibility: 'private',
          country_code: trip.destination_country_code,
          local_name: input.localName,
          translated_name: input.translatedName,
          address_local: input.addressLocal,
          address_translated: input.addressTranslated,
          region: input.region,
          category: input.category,
          google_map_url: input.googleMapUrl || null
        })
        .select()
        .single();
      const placeRow = requireData(placeResult.data, placeResult.error);
      const tripPlaceResult = await client
        .from('trip_places')
        .insert({
          trip_id: input.tripId,
          place_id: placeRow.id,
          collected_item_id: input.collectedItemId,
          memo: input.memo,
          status: 'candidate'
        })
        .select()
        .single();

      if (tripPlaceResult.error) {
        await client.from('places').delete().eq('id', placeRow.id);
        throw new Error(tripPlaceResult.error.message);
      }
      const update = await client
        .from('collected_items')
        .update({status: 'organized'})
        .eq('id', input.collectedItemId);
      if (update.error) throw new Error(update.error.message);
      return mapTripPlace(
        requireData(tripPlaceResult.data, null),
        mapPlace(placeRow)
      );
    },

    async addItineraryItem(input) {
      const placeResult = await client
        .from('trip_places')
        .select('*')
        .eq('id', input.tripPlaceId)
        .eq('trip_id', input.tripId)
        .single();
      const tripPlaceRow = requireData(placeResult.data, placeResult.error);
      const basePlaceResult = await client
        .from('places')
        .select('*')
        .eq('id', tripPlaceRow.place_id)
        .single();
      const basePlace = mapPlace(
        requireData(basePlaceResult.data, basePlaceResult.error)
      );
      const countResult = await client
        .from('itinerary_items')
        .select('id', {count: 'exact', head: true})
        .eq('trip_id', input.tripId)
        .eq('date', input.date);
      if (countResult.error) throw new Error(countResult.error.message);
      const insertResult = await client
        .from('itinerary_items')
        .insert({
          trip_id: input.tripId,
          trip_place_id: input.tripPlaceId,
          date: input.date,
          start_time: input.startTime || null,
          title: basePlace.translatedName || basePlace.localName,
          memo: input.memo ?? '',
          sort_order: countResult.count ?? 0
        })
        .select()
        .single();
      const update = await client
        .from('trip_places')
        .update({status: 'planned'})
        .eq('id', input.tripPlaceId);
      if (update.error) throw new Error(update.error.message);
      return mapItineraryItem(
        requireData(insertResult.data, insertResult.error),
        mapTripPlace(tripPlaceRow, basePlace)
      );
    },

    async moveItineraryItem(tripId, itemId, direction) {
      const targetResult = await client
        .from('itinerary_items')
        .select('*')
        .eq('id', itemId)
        .eq('trip_id', tripId)
        .single();
      const target = requireData(targetResult.data, targetResult.error);
      const siblingsResult = await client
        .from('itinerary_items')
        .select('*')
        .eq('trip_id', tripId)
        .eq('date', target.date)
        .order('sort_order');
      if (siblingsResult.error) throw new Error(siblingsResult.error.message);
      const index = siblingsResult.data.findIndex((row) => row.id === itemId);
      const sibling = siblingsResult.data[index + direction];
      if (!sibling) return;
      const [first, second] = await Promise.all([
        client
          .from('itinerary_items')
          .update({sort_order: sibling.sort_order})
          .eq('id', target.id),
        client
          .from('itinerary_items')
          .update({sort_order: target.sort_order})
          .eq('id', sibling.id)
      ]);
      if (first.error) throw new Error(first.error.message);
      if (second.error) throw new Error(second.error.message);
    },

    async createReservation(input) {
      const response = await client
        .from('reservations')
        .insert({
          trip_id: input.tripId,
          type: input.type,
          title: input.title,
          reservation_date: input.reservationDate,
          reservation_time: input.reservationTime || null,
          confirmation_number: input.confirmationNumber || null,
          booked_name: input.bookedName || null,
          address: input.address || null,
          original_url: input.originalUrl || null,
          cancellation_deadline: input.cancellationDeadline || null,
          payment_status: input.paymentStatus,
          memo: input.memo ?? ''
        })
        .select()
        .single();
      return mapReservation(requireData(response.data, response.error));
    },

    async updateReservation(input) {
      const response = await client
        .from('reservations')
        .update({
          type: input.type,
          title: input.title,
          reservation_date: input.reservationDate,
          reservation_time: input.reservationTime || null,
          confirmation_number: input.confirmationNumber || null,
          booked_name: input.bookedName || null,
          address: input.address || null,
          original_url: input.originalUrl || null,
          cancellation_deadline: input.cancellationDeadline || null,
          payment_status: input.paymentStatus,
          memo: input.memo ?? ''
        })
        .eq('trip_id', input.tripId)
        .eq('id', input.id)
        .select()
        .single();
      return mapReservation(requireData(response.data, response.error));
    },

    async deleteReservation(tripId, reservationId) {
      const response = await client
        .from('reservations')
        .delete()
        .eq('trip_id', tripId)
        .eq('id', reservationId);
      if (response.error) throw new Error(response.error.message);
    }
  };
}
