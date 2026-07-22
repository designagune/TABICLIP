import {z} from 'zod';

const dataModeSchema = z.enum(['mock', 'supabase']);

export type DataMode = z.infer<typeof dataModeSchema>;

export function getDataMode(): DataMode {
  return dataModeSchema.parse(process.env.NEXT_PUBLIC_DATA_MODE);
}
