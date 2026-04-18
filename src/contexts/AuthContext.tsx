import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { users } from '../services/lf';
import { userManager, type OidcUser } from '../services/oidc';

export interface UserProfile {
  sub: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: UserProfile | null;
  oidcUser: OidcUser | null;
  loading: boolean;
  signingIn: boolean;
  signingOut: boolean;
  isAdmin: boolean;
  isConfigured: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function syncProfile(oidcUser: OidcUser): Promise<UserProfile> {
  const sub = oidcUser.profile.sub;
  const email = (oidcUser.profile.email as string) ?? '';
  const name =
    (oidcUser.profile.name as string) ??
    (oidcUser.profile.preferred_username as string) ??
    email.split('@')[0];
  const avatarUrl = oidcUser.profile.picture as string | undefined;

  try {
    // Fetch user profile from API (response interceptor already extracts data)
    const profile = await users.usersControllerGetMe();

    if (profile) {
      return {
        sub: (profile as any).sub ?? sub,
        email: (profile as any).email ?? email,
        name: (profile as any).name ?? name,
        avatarUrl: (profile as any).avatarUrl ?? (profile as any).avatar_url ?? avatarUrl,
        role: ((profile as any).role as 'user' | 'admin') ?? 'user',
      };
    }
  } catch (error) {
    console.warn('Failed to fetch user profile from API, using OIDC data:', error);
  }

  // Fallback to OIDC profile data
  return { sub, email, name, avatarUrl, role: 'user' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [oidcUser, setOidcUser] = useState<OidcUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const isConfigured = userManager !== null;

  const loadUser = useCallback(async (ou: OidcUser | null) => {
    if (!ou) {
      setOidcUser(null);
      setUser(null);
      localStorage.removeItem('token');
      return;
    }
    setOidcUser(ou);

    // Store Authentik access token for API calls
    if (ou.access_token) {
      localStorage.setItem('token', ou.access_token);
    }

    const profile = await syncProfile(ou);
    setUser(profile);
  }, []);

  useEffect(() => {
    if (!userManager) {
      // Defer state update to avoid sync setState in effect
      const id = requestAnimationFrame(() => setLoading(false));
      return () => cancelAnimationFrame(id);
    }

    const mgr = userManager;

    mgr.getUser().then(async (ou) => {
      await loadUser(ou);
      setLoading(false);
    });

    const onLoggedIn = async (ou: OidcUser) => {
      await loadUser(ou);
      setLoading(false);
    };
    const onLoggedOut = () => {
      setOidcUser(null);
      setUser(null);
      localStorage.removeItem('token');
    };

    mgr.events.addUserLoaded(onLoggedIn);
    mgr.events.addUserUnloaded(onLoggedOut);
    mgr.events.addSilentRenewError(() => {
      console.warn('Silent renew failed');
    });

    return () => {
      mgr.events.removeUserLoaded(onLoggedIn);
      mgr.events.removeUserUnloaded(onLoggedOut);
    };
  }, [loadUser]);

  const signIn = useCallback(async () => {
    if (userManager) {
      setSigningIn(true);
      try {
        await userManager.signinRedirect();
      } finally {
        setSigningIn(false);
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      localStorage.removeItem('token');
      if (userManager) await userManager.signoutRedirect();
      setUser(null);
      setOidcUser(null);
    } finally {
      setSigningOut(false);
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, oidcUser, loading, signingIn, signingOut, isAdmin, isConfigured, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Re-export useAuth from separate file for fast refresh compatibility
export { useAuth } from './useAuth';
