import {getDataMode} from '@/lib/data-mode';
import {createClient} from '@/lib/supabase/client';

export interface MagicLinkInput {
  email: string;
  redirectTo: string;
}

export async function requestMagicLink(input: MagicLinkInput): Promise<void> {
  if (getDataMode() === 'mock') return;
  const {error} = await createClient().auth.signInWithOtp({
    email: input.email,
    options: {emailRedirectTo: input.redirectTo, shouldCreateUser: true}
  });
  if (error) throw new Error(error.message);
}
