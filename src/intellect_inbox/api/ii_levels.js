import { ii_supabase } from "../../constants/supabaseClient";

export async function read_ii_levels() {
  console.log('reading ii_levels');

  let { data, error } = await ii_supabase
  .from('ii_levels')
  .select(`
          *
            )
        `)

if (error) {
    console.error('Error selecting levels:', error);
}
return data;
}
