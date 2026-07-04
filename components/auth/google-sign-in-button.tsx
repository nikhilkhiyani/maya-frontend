'use client'

import { GoogleLogin, CredentialResponse } from '@react-oauth/google'

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void | Promise<void>
  onError?: (message: string) => void
  disabled?: boolean
}

export function GoogleSignInButton({ onSuccess, onError, disabled }: GoogleSignInButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!clientId) {
    return null
  }

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      onError?.('Google sign-in failed. Please try again.')
      return
    }
    await onSuccess(response.credential)
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-50' : ''}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.('Google sign-in was cancelled or failed.')}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  )
}
