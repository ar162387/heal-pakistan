import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { AdminUser } from "@/types/admin";

export async function signInWithPassword(email: string, password: string): Promise<Session | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (userId) {
    await touchLastLogin(userId);
  }
  return data.session ?? null;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session ?? null;
}

export async function fetchAdminProfile(userId: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function touchLastLogin(userId: string) {
  const { error } = await supabase
    .from("admin_users")
    .update({ last_login: new Date().toISOString() })
    .eq("user_id", userId);

  // Avoid throwing here to keep login flow resilient
  if (error) {
    console.warn("Failed to update last_login", error.message);
  }
}

