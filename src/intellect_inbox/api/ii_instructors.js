import { ii_supabase } from "../../constants/supabaseClient";

export async function read_ii_instructors() {
  console.log('reading ii_subjects');

  let { data, error } = await ii_supabase
  .from('ii_instructors')
  .select(`
          *
            )
        `)
  .eq('status', 1)
  .order('order_id', {ascending: true});

if (error) {
    console.error('Error selecting instructors:', error);
}
return data;
}
