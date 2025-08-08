import { createClient } from '@supabase/supabase-js';
import { 
    REACT_APP_II_SUPABASE_KEY, 
    REACT_APP_II_SUPABASE_URL,
    REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_KEY
} from './constants';

// Dynamic client selection based on environment variable
const useNewInstance = process.env.REACT_APP_USE_NEW_SUPABASE === 'true';

export const ii_supabase = createClient(
    useNewInstance ? REACT_APP_SUPABASE_URL : REACT_APP_II_SUPABASE_URL,
    useNewInstance ? REACT_APP_SUPABASE_KEY : REACT_APP_II_SUPABASE_KEY
);

// Legacy client for fallback if needed
export const ii_supabase_legacy = createClient(
    REACT_APP_II_SUPABASE_URL,
    REACT_APP_II_SUPABASE_KEY
);
