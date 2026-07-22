import {createServerClient} from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import type {NextRequest} from 'next/server';

import {routing} from '@/i18n/routing';
import type {Database} from '@/lib/supabase/database.types';

const handleInternationalization = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = handleInternationalization(request);
  if (process.env.NEXT_PUBLIC_DATA_MODE !== 'supabase') return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({name, value}) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({name, value, options}) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
