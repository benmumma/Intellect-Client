import { ii_supabase } from "../../constants/supabaseClient";


export async function ii_admin_fetch() {
    console.log('reading ii_admin_fetch');

    let { data, error } = await ii_supabase
            .from('ii_posts')
            .select(`
            *,
            ii_post_versions!left (
              post_id, 
              version, 
              created_at, 
              post_url, 
              status
            ),
            ii_user_posts:ii_user_posts!left (
              version, 
              rating, 
              thread_id
            ),
            ii_audiences:ii_audiences!left (
              id, 
              audience_name, 
              audience_key, 
              status
            ),
            ii_subjects:ii_subjects!left (
              id, 
              subject_name, 
              private_user_id, 
              status
            )
          `)
            .order('created_at', { ascending: false });
        if (error) {
        console.error('Error fetching lessons:', error);
        } else {
        console.log('Lessons fetched:', data);
        return data;
        }

  if (error) {
      console.error('Error selecting audiences:', error);
  }
  //console.log(data);
  return data;
  }