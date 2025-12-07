import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { AdminUser, AdminRole } from "@/types/admin";
import { fetchAdminProfile, fetchSession, signOutUser, touchLastLogin } from "@/api/auth";

interface AuthContextValue {
  session: Session | null;
  profile: AdminUser | null;
  role: AdminRole | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(
    async (userId?: string) => {
      const targetId = userId ?? session?.user?.id;
      if (!targetId) return;

      try {
        const data = await fetchAdminProfile(targetId);
        setProfile(data);
      } catch (error) {
        console.error("Failed to load admin profile", error);
        setProfile(null);
      }
    },
    [session?.user?.id]
  );

  useEffect(() => {
    let mounted = true;

    const loadInitialSession = async () => {
      try {
        const currentSession = await fetchSession();
        if (!mounted) return;
        setSession(currentSession);
        if (currentSession?.user?.id) {
          // Fire-and-forget profile hydrate + last_login touch; don't block auth readiness
          refreshProfile(currentSession.user.id);
          touchLastLogin(currentSession.user.id).catch((error) =>
            console.warn("Failed to update last_login", error?.message ?? error)
          );
        }
      } catch (error) {
        console.error("Failed to fetch session", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadInitialSession();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user?.id) {
        refreshProfile(newSession.user.id);
        touchLastLogin(newSession.user.id).catch((error) =>
          console.warn("Failed to update last_login", error?.message ?? error)
        );
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [refreshProfile]);
  const handleSignOut = async () => {
    await signOutUser();
    setSession(null);
    setProfile(null);
    setLoading(false);
  };

  const value: AuthContextValue = {
    session,
    profile,
    role: profile?.role ?? null,
    loading,
    refreshProfile,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

