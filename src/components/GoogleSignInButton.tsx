import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

function isMobileBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/** Backend URL Google should POST the ID token to (redirect UX on mobile). */
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
 * Desktop: popup (onSuccess).
 * Mobile: redirect — Google posts to backend, which bounces back to /#google_auth=...
 */
export function GoogleSignInButton({ text = 'signin_with', onCredential, onError }: GoogleSignInButtonProps) {
  const useRedirect = isMobileBrowser();

  return (
    <div className="flex justify-center w-full">
      <GoogleLogin
        ux_mode={useRedirect ? 'redirect' : 'popup'}
        login_uri={useRedirect ? googleCallbackUri() : undefined}
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
