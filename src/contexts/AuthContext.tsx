import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { userManager, type OidcUser } from '../services/oidc';
import { supabase } from '../services/supabase';

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

  if (supabase) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(
        { sub, email, name, avatar_url: avatarUrl ?? null },
        { onConflict: 'sub', ignoreDuplicates: false }
      )
      .select()
      .single();

    if (!error && data) {
      return {
        sub: data.sub,
        email: data.email,
        name: data.name,
        avatarUrl: data.avatar_url ?? undefined,
        role: data.role as 'user' | 'admin',
      };
    }

    // Fallback: try reading existing
    const { data: existing } = await supabase
      .from('user_profiles')
      .select()
      .eq('sub', sub)
      .single();

    if (existing) {
      return {
        sub: existing.sub,
        email: existing.email,
        name: existing.name,
        avatarUrl: existing.avatar_url ?? undefined,
        role: existing.role as 'user' | 'admin',
      };
    }
  }

  return { sub, email, name, avatarUrl, role: 'user' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [oidcUser, setOidcUser] = useState<OidcUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = userManager !== null;

  const loadUser = useCallback(async (ou: OidcUser | null) => {
    if (!ou) {
      setOidcUser(null);
      setUser(null);
      return;
    }
    setOidcUser(ou);
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
    if (userManager) await userManager.signinRedirect();
  }, []);

  const signOut = useCallback(async () => {
    if (userManager) await userManager.signoutRedirect();
    setUser(null);
    setOidcUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, oidcUser, loading, isAdmin, isConfigured, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Re-export useAuth from separate file for fast refresh compatibility
export { useAuth } from './useAuth';
