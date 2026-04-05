import { UserManager, type User as OidcUser } from 'oidc-client-ts';

const authority = import.meta.env.VITE_AUTHENTIK_ISSUER as string | undefined;
const clientId = import.meta.env.VITE_AUTHENTIK_CLIENT_ID as string | undefined;
const redirectUri = import.meta.env.VITE_AUTHENTIK_REDIRECT_URI as string | undefined;
const clientSecret = import.meta.env.VITE_AUTHENTIK_CLIENT_SECRET as string | undefined;

// OIDC is optional — app works without auth config
export const userManager = authority && clientId && redirectUri
  ? new UserManager({
      authority,
      client_id: clientId,
      ...(clientSecret ? { client_secret: clientSecret } : {}),
      redirect_uri: redirectUri,
      post_logout_redirect_uri: window.location.origin + '/auth',
      response_type: 'code',
      scope: 'openid profile email',
    })
  : null;

export type { OidcUser };
