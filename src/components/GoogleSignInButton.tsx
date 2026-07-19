import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

/** Backend URL Google POSTs the ID token to (redirect UX). */
export function googleCallbackUri(): string {
  const configured = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');
  const base = configured && configured.length > 0 ? configured : window.location.origin;
  return `${base}/api/auth/google-callback`;
}

type GoogleSignInButtonProps = {
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  onCredential: (response: CredentialResponse) => void;
  onError: () => void;
};

/**
 * Always use redirect UX. Popup breaks on many mobile browsers (blank Google page).
 * Google posts the ID token to the backend; backend redirects to /#google_auth=...
 * onSuccess is only a fallback if GIS still delivers a credential in-page.
 */
export function GoogleSignInButton({ text = 'signin_with', onCredential, onError }: GoogleSignInButtonProps) {
  return (
    <div className="flex justify-center w-full">
      <GoogleLogin
        ux_mode="redirect"
        login_uri={googleCallbackUri()}
        onSuccess={onCredential}
        onError={onError}
        theme="outline"
        size="large"
        width="384"
        text={text}
        shape="rectangular"
      />
    </div>
  );
}
