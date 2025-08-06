import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useLocation, useHistory } from 'react-router-dom'

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const accessToken = urlParams.get('access_token')
    const type = urlParams.get('type')

    if (type === 'recovery' && accessToken) {
      // Update the auth session to include the access token
      supabase.auth.setSession(accessToken)
    }
  }, [location])

  const handlePasswordReset = async () => {
    const { error, user } = await supabase.auth.update({ password: newPassword })
    if (error) {
      setMessage('Error resetting password')
    } else {
      setMessage('Password reset successfully')
      history.push('/login') // Redirect to login after password reset
    }
  }

  return (
    <div>
      <h2>Set New Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handlePasswordReset}>Set Password</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default ResetPassword
