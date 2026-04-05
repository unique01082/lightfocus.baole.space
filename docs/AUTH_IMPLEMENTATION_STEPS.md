# Authentication - Step-by-Step Implementation

> Hướng dẫn implement authentication từ A-Z trong 30 phút

## Prerequisites

```bash
# Node.js 18+
node --version

# Project đã có React + TypeScript + React Router
```

## Step 1: Install Dependencies

```bash
npm install oidc-client-ts @supabase/supabase-js
```

## Step 2: Setup Environment Variables

Tạo file `.env`:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Authentik OIDC
VITE_AUTHENTIK_ISSUER=https://auth.yourdomain.com/application/o/your-app/
VITE_AUTHENTIK_CLIENT_ID=your_client_id_here
VITE_AUTHENTIK_REDIRECT_URI=http://localhost:5173/auth/callback

# Optional: Chỉ cần nếu dùng Confidential Client
# VITE_AUTHENTIK_CLIENT_SECRET=
```

## Step 3: Create Supabase Service

Tạo file `src/services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Không dùng Supabase Auth
  },
});
```

## Step 4: Create OIDC Service

Tạo file `src/services/oidc.ts`:

```typescript
import { UserManager, type User as OidcUser } from 'oidc-client-ts';

const clientSecret = import.meta.env.VITE_AUTHENTIK_CLIENT_SECRET as string | undefined;

const oidcConfig = {
  authority: import.meta.env.VITE_AUTHENTIK_ISSUER as string,
  client_id: import.meta.env.VITE_AUTHENTIK_CLIENT_ID as string,
  ...(clientSecret ? { client_secret: clientSecret } : {}),
  redirect_uri: import.meta.env.VITE_AUTHENTIK_REDIRECT_URI as string,
  post_logout_redirect_uri: window.location.origin + '/auth',
  response_type: 'code',
  scope: 'openid profile email',
};

export const userManager = new UserManager(oidcConfig);

export type { OidcUser };
```

## Step 5: Create Database Table

Trong Supabase SQL Editor, chạy:

```sql
-- User Profiles Table
CREATE TABLE user_profiles (
  sub TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for faster lookups
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
```

## Step 6: Create AuthContext

Tạo file `src/contexts/AuthContext.tsx`:

```typescript
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { userManager, type OidcUser } from "../services/oidc";
import { supabase } from "../services/supabase";

export interface UserProfile {
  sub: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: UserProfile | null;
  oidcUser: OidcUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sync user profile to Supabase
async function syncProfile(oidcUser: OidcUser): Promise<UserProfile> {
  const sub = oidcUser.profile.sub;
  const email = (oidcUser.profile.email as string) ?? "";
  const name =
    (oidcUser.profile.name as string) ??
    (oidcUser.profile.preferred_username as string) ??
    email.split("@")[0];
  const avatarUrl = oidcUser.profile.picture as string | undefined;

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      { sub, email, name, avatar_url: avatarUrl ?? null },
      { onConflict: "sub", ignoreDuplicates: false }
    )
    .select()
    .single();

  if (error || !data) {
    // Fallback: try reading existing
    const { data: existing } = await supabase
      .from("user_profiles")
      .select()
      .eq("sub", sub)
      .single();

    if (existing) {
      return {
        sub: existing.sub,
        email: existing.email,
        name: existing.name,
        avatarUrl: existing.avatar_url ?? undefined,
        role: existing.role as "user" | "admin",
      };
    }

    // Final fallback: local profile
    return { sub, email, name, avatarUrl, role: "user" };
  }

  return {
    sub: data.sub,
    email: data.email,
    name: data.name,
    avatarUrl: data.avatar_url ?? undefined,
    role: data.role as "user" | "admin",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [oidcUser, setOidcUser] = useState<OidcUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
    // Restore session from storage
    userManager.getUser().then(async (ou) => {
      await loadUser(ou);
      setLoading(false);
    });

    // Listen for auth events
    const onLoggedIn = async (ou: OidcUser) => {
      await loadUser(ou);
      setLoading(false);
    };
    const onLoggedOut = () => {
      setOidcUser(null);
      setUser(null);
    };

    userManager.events.addUserLoaded(onLoggedIn);
    userManager.events.addUserUnloaded(onLoggedOut);
    userManager.events.addSilentRenewError(() => {
      console.warn("Silent renew failed");
    });

    return () => {
      userManager.events.removeUserLoaded(onLoggedIn);
      userManager.events.removeUserUnloaded(onLoggedOut);
    };
  }, [loadUser]);

  const signIn = useCallback(async () => {
    await userManager.signinRedirect();
  }, []);

  const signOut = useCallback(async () => {
    await userManager.signoutRedirect();
    setUser(null);
    setOidcUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, oidcUser, loading, isAdmin, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
```

## Step 7: Create Auth Pages

### Login Page

Tạo file `src/pages/AuthPage.tsx`:

```typescript
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function AuthPage() {
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Welcome</h1>
        <button
          onClick={signIn}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Sign in with SSO"}
        </button>
      </div>
    </div>
  );
}
```

### Callback Page

Tạo file `src/pages/AuthCallbackPage.tsx`:

```typescript
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { userManager } from "../services/oidc";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("Auth callback error:", err);
        navigate("/auth", { replace: true });
      });
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        <p className="text-sm text-gray-500">Completing sign in…</p>
      </div>
    </div>
  );
}
```

## Step 8: Create Protected Route Component

Tạo file `src/components/auth/ProtectedRoute.tsx`:

```typescript
import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
```

### Admin Route (Optional)

Tạo file `src/components/auth/AdminRoute.tsx`:

```typescript
import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
```

## Step 9: Setup Routes

Update `src/App.tsx` hoặc routes file:

```typescript
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { AuthPage } from "./pages/AuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

## Step 10: Configure Authentik

1. **Tạo Application trong Authentik:**
   - Go to Applications → Create
   - Name: `Your App Name`
   - Slug: `your-app`

2. **Tạo Provider:**
   - Type: **OAuth2/OpenID Provider**
   - Client Type: **Public** (for PKCE)
   - Redirect URIs:
     ```
     http://localhost:5173/auth/callback
     https://yourdomain.com/auth/callback
     ```

3. **Configure Scopes:**
   - `openid` ✓
   - `email` ✓
   - `profile` ✓

4. **Copy Credentials:**
   - Client ID → `.env` file
   - Issuer URL → `.env` file (format: `https://auth.domain.com/application/o/your-app/`)

## Step 11: Test Authentication

```bash
npm run dev
```

1. ✅ Visit `http://localhost:5173`
2. ✅ Should redirect to `/auth`
3. ✅ Click "Sign in"
4. ✅ Redirect to Authentik
5. ✅ Login với credentials
6. ✅ Redirect back to `/auth/callback`
7. ✅ Should land on `/` (home page)
8. ✅ Refresh page → should stay logged in

## Step 12: Use Auth in Components

```typescript
import { useAuth } from "../contexts/AuthContext";

function MyComponent() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>
      {isAdmin && <p>You are an admin</p>}
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

## Step 13: Filter Data by User (Optional)

Nếu cần filter data theo user:

```typescript
// Example: Add user_sub column to your tables
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_sub TEXT REFERENCES user_profiles(sub),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

// In your API service
import { supabase } from './supabase';

export async function getMyItems(userSub: string) {
  const { data } = await supabase
    .from('items')
    .select('*')
    .eq('user_sub', userSub);
  
  return data || [];
}

// Usage in component
const { user } = useAuth();
const items = await getMyItems(user.sub);
```

## Step 14: Add Logout Button

```typescript
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav>
      <span>{user?.name}</span>
      <button onClick={signOut}>Logout</button>
    </nav>
  );
}
```

## Troubleshooting

### Issue 1: "Invalid redirect URI"

**Fix:** Check Authentik redirect URIs match EXACTLY với `VITE_AUTHENTIK_REDIRECT_URI`

### Issue 2: "User not found in database"

**Fix:** 
```sql
-- Check table exists
SELECT * FROM user_profiles LIMIT 1;

-- Check RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (for new users)
CREATE POLICY "Allow anonymous insert" 
ON user_profiles FOR INSERT 
WITH CHECK (true);
```

### Issue 3: Infinite redirect loop

**Fix:** Check `loading` state logic:
```typescript
if (loading) {
  return <Loading />;  // Must return something while loading
}
```

### Issue 4: Token không persist sau refresh

**Fix:** UserManager auto-saves to sessionStorage. Check browser console:
```javascript
// Inspect
const user = await userManager.getUser();
console.log(user);
```

### Issue 5: CORS errors

**Fix:** Check Supabase CORS settings hoặc Authentik allowed origins

## Quick Reference

### Get current user
```typescript
const { user, loading, isAdmin } = useAuth();
```

### Login
```typescript
const { signIn } = useAuth();
await signIn();
```

### Logout
```typescript
const { signOut } = useAuth();
await signOut();
```

### Protect route
```typescript
<ProtectedRoute>
  <YourPage />
</ProtectedRoute>
```

### Admin-only route
```typescript
<AdminRoute>
  <AdminPage />
</AdminRoute>
```

### Check token
```javascript
const user = await userManager.getUser();
console.log('Token:', user?.access_token);
console.log('Expires:', new Date(user?.expires_at * 1000));
```

## Next Steps

- [ ] Add role-based permissions
- [ ] Implement API token injection
- [ ] Add profile edit page
- [ ] Setup RLS policies in Supabase
- [ ] Add SSO with multiple providers
- [ ] Implement MFA
- [ ] Add session timeout handling

## File Checklist

```
✅ .env
✅ src/services/supabase.ts
✅ src/services/oidc.ts
✅ src/contexts/AuthContext.tsx
✅ src/pages/AuthPage.tsx
✅ src/pages/AuthCallbackPage.tsx
✅ src/components/auth/ProtectedRoute.tsx
✅ src/components/auth/AdminRoute.tsx (optional)
✅ src/App.tsx (updated with AuthProvider)
✅ Database table: user_profiles
✅ Authentik application configured
```

## Time Estimate

- **Basic Setup (Steps 1-9):** 20-30 minutes
- **Authentik Config (Step 10):** 10 minutes
- **Testing (Step 11):** 5 minutes
- **Customization (Steps 12-14):** 10-20 minutes

**Total:** ~45-65 minutes

---

**Done!** Bạn đã có authentication system hoàn chỉnh với OIDC + Supabase.

Xem thêm:
- [Full Guide](./AUTHENTICATION_GUIDE.md) - Chi tiết 800+ dòng
- [Quick Ref](./AUTH_QUICK_REFERENCE.md) - Cheat sheet
- [Diagrams](./AUTH_FLOW_DIAGRAMS.md) - Visual flows
