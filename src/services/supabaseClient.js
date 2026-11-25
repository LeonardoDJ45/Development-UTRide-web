import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfgnhofnetgpelmoqvxo.supabase.co';
const supabaseAnonKey = 'sb_publishable_uAFrLzrLJ7F6TjqU_QzOuA_Ztklfi4j';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)