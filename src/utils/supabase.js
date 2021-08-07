import { createClient } from '@supabase/supabase-js';

const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);
