import { supabase } from "@/lib/supabaseClient";
import { AdminUser, AdminRole, AdminStatus } from "@/types/admin";
import { logActivity } from "./activity";

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface UpdateAdminUserInput {
  role?: AdminRole;
  status?: AdminStatus;
  name?: string;
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.from("admin_users").select("*").order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
  const { email, password, role, name } = input;

  // Preserve the current admin session so signUp doesn't switch us to the new user
  const {
    data: { session: currentSession },
  } = await supabase.auth.getSession();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (authError) throw authError;
  const newUserId = authData.user?.id;
  if (!newUserId) {
    throw new Error("Failed to create authentication user");
  }

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      user_id: newUserId,
      name,
      email,
      role,
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    action: "created_user",
    entity: "admin_users",
    entityId: newUserId,
    metadata: { name, email, role },
  });

  // Restore original admin session if it existed
  if (currentSession?.access_token && currentSession.refresh_token) {
    await supabase.auth.setSession({
      access_token: currentSession.access_token,
      refresh_token: currentSession.refresh_token,
    });
  }

  return data as AdminUser;
}

export async function updateAdminUser(userId: string, updates: UpdateAdminUserInput): Promise<AdminUser> {
  const { data, error } = await supabase
    .from("admin_users")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    action: "updated_user",
    entity: "admin_users",
    entityId: userId,
    metadata: updates,
  });

  return data as AdminUser;
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const { error } = await supabase.from("admin_users").delete().eq("user_id", userId);
  if (error) throw error;

  await logActivity({
    action: "deleted_user",
    entity: "admin_users",
    entityId: userId,
  });
}

