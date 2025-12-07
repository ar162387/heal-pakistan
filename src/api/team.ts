import { supabase } from "@/lib/supabaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { logActivity } from "./activity";
import { TeamMember, PublicTeamMember, TeamRole } from "@/types/team";

export interface TeamFilters {
  role?: TeamRole;
  search?: string;
}

export interface CreateTeamMemberInput {
  name: string;
  role: TeamRole;
  designation?: string;
  university?: string;
  photo_url?: string;
  description?: string;
  is_published?: boolean;
}

export type UpdateTeamMemberInput = Partial<CreateTeamMemberInput>;

export async function uploadTeamPhoto(file: File): Promise<string> {
  return uploadImageToCloudinary(file);
}

export async function listTeamMembers(filters: TeamFilters = {}): Promise<TeamMember[]> {
  const { role, search } = filters;
  let query = supabase.from("team_members").select("*").order("created_at", { ascending: false });

  if (role) {
    query = query.eq("role", role);
  }

  if (search) {
    const like = `%${search}%`;
    query = query.or(`name.ilike.${like},designation.ilike.${like},university.ilike.${like}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as TeamMember[]) ?? [];
}

export async function createTeamMember(input: CreateTeamMemberInput): Promise<TeamMember> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to create team member records.");
  }

  const payload = {
    ...input,
    is_published: input.is_published ?? true,
    created_by: userId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("team_members").insert(payload).select().single();
  if (error) throw error;

  await logActivity({
    action: "created_team_member",
    entity: "team_members",
    entityId: data.id,
    metadata: {
      name: data.name,
      role: data.role,
      designation: data.designation,
    },
  });

  return data as TeamMember;
}

export async function updateTeamMember(id: string, updates: UpdateTeamMemberInput): Promise<TeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    action: "updated_team_member",
    entity: "team_members",
    entityId: id,
    metadata: updates,
  });

  return data as TeamMember;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw error;

  await logActivity({
    action: "deleted_team_member",
    entity: "team_members",
    entityId: id,
  });
}

export async function fetchPublicTeamMembers(): Promise<PublicTeamMember[]> {
  const { data, error } = await supabase.rpc("get_public_team_members");

  if (error) throw error;
  return (data as PublicTeamMember[]) ?? [];
}
