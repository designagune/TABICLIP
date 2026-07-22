import {NextResponse, type NextRequest} from 'next/server';

import {createClient} from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{locale: string}>}
) {
  const {locale} = await params;
  const code = request.nextUrl.searchParams.get('code');
  const requestedNext = request.nextUrl.searchParams.get('next');
  const fallback = `/${locale}/app`;
  const next = requestedNext?.startsWith(`/${locale}/`)
    ? requestedNext
    : fallback;
  if (code) {
    const {error} = await (
      await createClient()
    ).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
}
