import { createClient } from '@supabase/supabase-js';
import { REACT_APP_II_SUPABASE_KEY, REACT_APP_II_SUPABASE_URL } from './constants';


export const ii_supabase = createClient(
    REACT_APP_II_SUPABASE_URL,
    REACT_APP_II_SUPABASE_KEY
);
