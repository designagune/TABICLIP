import {createBrowserClient} from '@supabase/ssr';

import type {Database} from './database.types';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_CONFIGURATION_MISSING');
  browserClient ??= createBrowserClient<Database>(url, key);
  return browserClient;
}
