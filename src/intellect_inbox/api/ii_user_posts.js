import { ii_supabase } from "../../constants/supabaseClient";

export async function read_ii_user_posts_v2({user_id, limit_param = 1000, course_id = null, order_id = null}) {
  console.log('reading user posts');
  let transformedData = null;
  let query = ii_supabase
  .from('ii_posts')
  .select(`id,
          post_name,
          status,
          version,
          subject_id,
          audience_id,
          course_id,
          order_id,
          ii_user_posts:ii_user_posts!inner (
              is_read,
              is_flagged,
              created_at,
              rating,
              notes,
              thread_id
            ),
            ii_subjects:ii_subjects!inner (
            subject_name
            ),
            ii_audiences:ii_audiences!inner (
            audience_name
            ),
            ii_post_versions:ii_post_versions!inner (
            post_version:version,
            post_url
            ),
            ii_courses:ii_courses!left (
            course_subject,
            course_length
            )
            `
    )
  .eq('status', 1)
  .eq('ii_user_posts.user_id', user_id)
  .limit(limit_param)
  .order('created_at', {ascending: false});

  if (course_id !== null) {
    query = query.eq('course_id', course_id);
  }
  if (order_id !== null) {
    query = query.eq('order_id', order_id);
  }

  let { data, error } = await query;

  if (error) {
    console.error('Error reading user posts:', error);
  }
  else {
    // Transform the data to flatten the subobject fields
  transformedData = data.map(item => {
    if (item.ii_user_posts) {
      return {
        ...item,
        ...item.ii_user_posts[0],
        ...item.ii_subjects,
        ...item.ii_audiences,
        ...item.ii_courses,
      };
    }
    return item;
  });

  //console.log(transformedData);
  }
  //console.log(data);
  return transformedData;
}


export async function read_ii_user_posts(userId) {
  console.log('reading user posts');
  //console.log(userId);
  let { data, error } = await ii_supabase.rpc('pull_user_posts_v2');

    //console.log(data);


  if (error) {
    console.error('Error reading user posts:', error);
  }
  //console.log(data);
  return data;
}

export async function read_top_ii_user_post(user_id, top = 1) {
  console.log('reading top user post');
  //console.log(user_id);
  let { data, error } = await ii_supabase.rpc('pull_user_posts_v2', { limit_param: top });
    
  if (error) {
    console.error('Error reading user posts:', error);
  }
  //console.log(data);
  return data;

}

export async function update_ii_user_post(data_to_update) {
  let { data, error } = await ii_supabase
  .from('ii_user_posts')
  .upsert([ data_to_update ], {onConflict: 'user_id,post_id'})
    .select('*');

if (error) {
    console.error('Error upserting user:', error);
    return {result:'error',message:'user upsert failed.'}
}
return {result:'success',message:'user upsert successful',data:data[0]}
}