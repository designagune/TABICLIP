'use client';

import {createClient} from '@/lib/supabase/client';
import {getDataMode} from '@/lib/data-mode';

import {mockTripWorkspaceRepository} from './mock-trip-workspace-repository';
import {createSupabaseTripWorkspaceRepository} from './supabase-trip-workspace-repository';
import type {TripWorkspaceRepository} from './trip-workspace-repository';

let repository: TripWorkspaceRepository | undefined;

export function getTripWorkspaceRepository(): TripWorkspaceRepository {
  if (repository) return repository;
  repository =
    getDataMode() === 'mock'
      ? mockTripWorkspaceRepository
      : createSupabaseTripWorkspaceRepository(createClient());
  return repository;
}
