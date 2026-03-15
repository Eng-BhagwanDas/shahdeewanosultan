import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for Storage and Auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export default {
    from: () => {
        throw new Error("Supabase client has been replaced with raw SQL. Please use the exported 'query' function.");
    }
};
