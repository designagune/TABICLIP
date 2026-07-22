'use client';

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import type {AddCollectedItemInput} from '@/features/collection/types/collected-item';
import type {AddItineraryItemInput} from '@/features/itinerary/types/itinerary';
import type {OrganizeCollectedItemInput} from '@/features/places/types/place';
import type {
  CreateReservationInput,
  UpdateReservationInput
} from '@/features/reservations/types/reservation';

import {getTripWorkspaceRepository} from '../repositories/browser-repository';
import type {CreateTripInput} from '../types/trip';
import {tripKeys} from './trip-keys';

export function useTrips() {
  return useQuery({
    queryKey: tripKeys.all,
    queryFn: () => getTripWorkspaceRepository().listTrips()
  });
}

export function useTripWorkspace(tripId: string) {
  return useQuery({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => getTripWorkspaceRepository().getWorkspace(tripId),
    enabled: Boolean(tripId)
  });
}

function useWorkspaceMutation<TInput, TOutput>(
  tripId: string,
  mutationFn: (input: TInput) => Promise<TOutput>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: tripKeys.detail(tripId)});
    }
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTripInput) =>
      getTripWorkspaceRepository().createTrip(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: tripKeys.all});
    }
  });
}

export function useAddCollectedItem(tripId: string) {
  return useWorkspaceMutation<AddCollectedItemInput, unknown>(tripId, (input) =>
    getTripWorkspaceRepository().addCollectedItem(input)
  );
}

export function useOrganizeCollectedItem(tripId: string) {
  return useWorkspaceMutation<OrganizeCollectedItemInput, unknown>(
    tripId,
    (input) => getTripWorkspaceRepository().organizeCollectedItem(input)
  );
}

export function useAddItineraryItem(tripId: string) {
  return useWorkspaceMutation<AddItineraryItemInput, unknown>(tripId, (input) =>
    getTripWorkspaceRepository().addItineraryItem(input)
  );
}

export function useMoveItineraryItem(tripId: string) {
  return useWorkspaceMutation<{itemId: string; direction: -1 | 1}, void>(
    tripId,
    ({itemId, direction}) =>
      getTripWorkspaceRepository().moveItineraryItem(tripId, itemId, direction)
  );
}

export function useCreateReservation(tripId: string) {
  return useWorkspaceMutation<CreateReservationInput, unknown>(
    tripId,
    (input) => getTripWorkspaceRepository().createReservation(input)
  );
}

export function useUpdateReservation(tripId: string) {
  return useWorkspaceMutation<UpdateReservationInput, unknown>(
    tripId,
    (input) => getTripWorkspaceRepository().updateReservation(input)
  );
}

export function useDeleteReservation(tripId: string) {
  return useWorkspaceMutation<string, void>(tripId, (reservationId) =>
    getTripWorkspaceRepository().deleteReservation(tripId, reservationId)
  );
}
