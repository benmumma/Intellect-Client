import { ii_supabase } from "../../constants/supabaseClient";

export async function read_ii_threads() {
  console.log('reading ii_threads');

  let { data, error } = await ii_supabase
  .from('ii_threads')
  .select(`
          *,
            ii_subjects (id, subject_name, is_available, is_premium, is_aggregation, aggregation_list),
            ii_audiences (id, audience_name, audience_key, status)
        `)

if (error) {
    console.error('Error selecting threads:', error);
}
//console.log(data);
return data;
}
