import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// No keys → demo mode: data in this browser only and any password works. The anon key is public by design; RLS protects data.
export const supabase = url && key ? createClient(url, key) : null;
