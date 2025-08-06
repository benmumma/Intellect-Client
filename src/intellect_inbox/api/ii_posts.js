import { ii_supabase } from "../../constants/supabaseClient";


export async function upsert_ii_post(ii_post_data) {
    let { data, error } = await ii_supabase
    .from('ii_posts')
    .upsert([ ii_post_data ], {onConflict: 'id' })
    .select('*')

  if (error) {
      console.error('Error upserting post:', error);
      return {result:'error',message:'user upsert failed.'}
  }
  return {result:'success',message:'post upsert successful',data:data[0]}
}