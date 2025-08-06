import { ii_supabase } from "../../constants/supabaseClient";

export async function read_ii_courses( course_id = null) {
  console.log('reading ii_subjects');

  // { data, error } = await
  let query = ii_supabase
  .from('ii_courses')
  .select(`
          *,
          ii_user_courses:ii_user_courses!left (
              latest_lesson,
              reception_time,
              timezone,
              dow_schedule,
              is_paused,
              status
            ),
            ii_instructors:ii_instructors!left (name,  description, image_url, text_id)
        `)
  .eq('status', 1)

  if (course_id !== null) {
    query = query.eq('id', course_id);
  }

  let { data, error } = await query;


if (error) {
    console.error('Error selecting subjects:', error);
}
//console.log(data);
return data;
}

export async function insert_ii_courses(insert_data) {
  console.log('upserting ii_subjects');
  //console.log(insert_data);
  const { data, error } = await ii_supabase
  .from('ii_courses')
  .insert([insert_data])
  .select('*');

  if (error) {
      console.error('Error upserting subjects:', error);
  }
  //console.log(data);
  return {result:'success',message:'subject upsert successful',data:data[0]};
}