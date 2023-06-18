import { createClient } from "@supabase/supabase-js";
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:3000";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "key";
export const supabase = createClient(supabaseUrl, supabaseKey);
