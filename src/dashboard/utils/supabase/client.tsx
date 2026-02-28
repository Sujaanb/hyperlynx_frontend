import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';
import { createMockSupabaseClient } from './mock';

let supabaseClient: any = null;
let isDemo = false;

export function createClient() {
  if (!supabaseClient) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;
    const supabaseKey =
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      publicAnonKey;

    // Use mock client if real credentials are missing (demo mode)
    if (!supabaseKey) {
      console.warn('[DEMO MODE] Using mock Supabase client. Auth changes will not persist.');
      supabaseClient = createMockSupabaseClient();
      isDemo = true;
    } else {
      supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);
      isDemo = false;
    }
  }
  return supabaseClient;
}

export function isDemoMode(): boolean {
  return isDemo;
}
