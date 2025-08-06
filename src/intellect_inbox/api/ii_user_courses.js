import { ii_supabase } from "../../constants/supabaseClient";

export async function read_ii_user_courses() {
  console.log('reading read_ii_user_courses');

  let { data, error } = await ii_supabase
  .from('ii_user_courses')
  .select(`
          *
        `)

if (error) {
    console.error('Error selecting subjects:', error);
}
//console.log(data);
return data;
}

export async function upsert_ii_user_courses(insert_data) {
  console.log('upserting upsert_ii_user_courses');
  //console.log(insert_data);
  const { data, error } = await ii_supabase
  .from('ii_user_courses')
  .upsert([insert_data], {onConflict: 'user_id,course_id'})
  .select('*');

  if (error) {
      console.error('Error upserting subjects:', error);
  }
  //console.log(data);
  return {result:'success',message:'subject upsert successful',data:data[0]};
}

export async function insert_ii_user_courses(insert_data) {
  console.log('upserting upsert_ii_user_courses');
  //console.log(insert_data);
  const { data, error } = await ii_supabase
  .from('ii_user_courses')
  .insert([insert_data]);

  if (error) {
      console.error('Error upserting subjects:', error);
  }
  //console.log(data);
  return {result:'success',message:'subject insert successful',data:data};
}