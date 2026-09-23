import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY?.trim();

if (!supabaseUrl || supabaseUrl.includes("your-project")) {
    console.error(
        "Set VITE_SUPABASE_URL in frontend/.env to your real project URL from Supabase → Project Settings → API, then restart the Vite dev server."
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);