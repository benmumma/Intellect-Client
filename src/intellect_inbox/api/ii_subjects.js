import { ii_supabase } from "../../constants/supabaseClient";

export async function read_ii_subjects() {
  console.log('reading ii_subjects');

  let { data, error } = await ii_supabase
  .from('ii_subjects')
  .select(`
          *
        `)
  .eq('status', 1)
  .order('order_id', {ascending: true})

if (error) {
    console.error('Error selecting subjects:', error);
}
//console.log(data);
return data;
}

export async function upsert_ii_subject(insert_data) {
  console.log('upserting ii_subjects');
  //console.log(insert_data);
  const { data, error } = await ii_supabase
  .from('ii_subjects')
  .insert([insert_data])
  .select('*');

  if (error) {
      console.error('Error upserting subjects:', error);
  }
  //console.log(data);
  return {result:'success',message:'subject upsert successful',data:data[0]};
}