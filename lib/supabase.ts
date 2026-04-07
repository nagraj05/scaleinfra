import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client with optional Clerk authentication.
 * If a token is provided, it's used for the Authorization header.
 */
export const createSupabaseClient = (clerkToken?: string) => {
  const headers: Record<string, string> = {};
  if (clerkToken) {
    headers.Authorization = `Bearer ${clerkToken}`;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers,
    },
  });
};

// Default anon client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
