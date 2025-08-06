import { ii_supabase } from "../../constants/supabaseClient";

export async function read_ii_audiences() {
  console.log('reading ii_audiences');

  let { data, error } = await ii_supabase
  .from('ii_audiences')
  .select(`
          *
        `)
  .eq('status', 1)
  .order('order_id', {ascending: true})

if (error) {
    console.error('Error selecting audiences:', error);
}
//console.log(data);
return data;
}
