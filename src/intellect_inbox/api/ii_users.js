import { ii_supabase } from "../../constants/supabaseClient";
import { API_BASE_URL } from "../../constants/constants";


export async function upsert_ii_user(ii_user_data) {
  console.log('upserting ii_user values');
  //console.log(ii_user_data);
  let { data, error } = await ii_supabase
    .from('ii_users')
    .upsert([ ii_user_data ], {onConflict: 'user_id' })
    .select('*');

  if (error) {
      console.error('Error upserting user:', error);
      return {result:'error',message:'user upsert failed.'}
  }
  return {result:'success',message:'user upsert successful',data:data[0]}
}

export async function insert_ii_user(ii_user_data) {
  console.log('inserting ii_user values');
  console.log(ii_user_data)
  //console.log(ii_user_data);
    let { data, error } = await ii_supabase
    .from('ii_users')
    .insert(ii_user_data)
    .select('*');

  if (error) {
      console.error('Error inserting user:', error);
      return {result:'error',message:'user insert failed.'}
  }
  return {result:'success',message:'user insert successful',data:data[0]}
}

export async function read_ii_user(userId) {
  console.log('reading ii_user values');
  //console.log(userId);
  let { data, error } = await ii_supabase
  .from('ii_users')
  .select(`
          *,
          ii_audiences (id, audience_name, audience_key, status),
          ii_subjects!public_ii_users_current_subject_fkey (id, subject_name)
        `)
  .eq('user_id', userId)

if (error) {
    console.error('Error reading user:', error);
}
//console.log(data);
return data;
}

// Create via backend using service role (avoids client-side RLS issues)
export async function create_ii_user_via_backend(ii_user_data) {
  try {
    const res = await fetch(`${API_BASE_URL}ii/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // send cookies if centralized auth uses them
      body: JSON.stringify({ ...ii_user_data, dbInstance: 'new' }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('Backend create ii_user failed:', json);
      return { result: 'error', message: json.message || 'backend create failed' };
    }
    return { result: 'success', message: 'user create successful', data: json.data };
  } catch (err) {
    console.error('Backend create ii_user exception:', err);
    return { result: 'error', message: 'network or server error' };
  }
}