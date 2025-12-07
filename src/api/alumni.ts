import { supabase } from "@/lib/supabaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { logActivity } from "./activity";
import { AlumniProfile, PublicAlumniProfile } from "@/types/alumni";

export interface AlumniFilters {
  search?: string;
  university?: string;
  batch?: string;
}

export interface CreateAlumniInput {
  full_name: string;
  university: string;
  batch: string;
  bio?: string;
  contact_email?: string;
  contact_phone?: string;
  profile_photo_url?: string;
  is_published?: boolean;
}

export type UpdateAlumniInput = Partial<CreateAlumniInput>;

export interface PublicAlumniFilters {
  search?: string;
  university?: string;
  batch?: string;
  limit?: number;
  offset?: number;
}

export async function uploadAlumniPhoto(file: File): Promise<string> {
  return uploadImageToCloudinary(file);
}

export async function listAlumni(filters: AlumniFilters = {}): Promise<AlumniProfile[]> {
  const { search, university, batch } = filters;
  let query = supabase.from("alumni_profiles").select("*").order("created_at", { ascending: false });

  if (search) {
    const like = `%${search}%`;
    query = query.or(`full_name.ilike.${like},university.ilike.${like},batch.ilike.${like}`);
  }

  if (university) {
    query = query.eq("university", university);
  }

  if (batch) {
    query = query.eq("batch", batch);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as AlumniProfile[]) ?? [];
}

export async function createAlumni(input: CreateAlumniInput): Promise<AlumniProfile> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to create alumni records.");
  }

  const payload = {
    ...input,
    is_published: input.is_published ?? true,
    created_by: userId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("alumni_profiles").insert(payload).select().single();
  if (error) throw error;

  await logActivity({
    action: "created_alumni",
    entity: "alumni_profiles",
    entityId: data.id,
    metadata: {
      name: data.full_name,
      university: data.university,
      batch: data.batch,
    },
  });

  return data as AlumniProfile;
}

export async function updateAlumni(id: string, updates: UpdateAlumniInput): Promise<AlumniProfile> {
  const { data, error } = await supabase
    .from("alumni_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    action: "updated_alumni",
    entity: "alumni_profiles",
    entityId: id,
    metadata: updates,
  });

  return data as AlumniProfile;
}

export async function deleteAlumni(id: string): Promise<void> {
  const { error } = await supabase.from("alumni_profiles").delete().eq("id", id);
  if (error) throw error;

  await logActivity({
    action: "deleted_alumni",
    entity: "alumni_profiles",
    entityId: id,
  });
}

export async function fetchPublicAlumni(filters: PublicAlumniFilters = {}): Promise<PublicAlumniProfile[]> {
  const { search = "", university = null, batch = null, limit = 100, offset = 0 } = filters;

  const { data, error } = await supabase.rpc("get_public_alumni", {
    search: search ?? "",
    university: university ?? null,
    batch: batch ?? null,
    limit_rows: limit,
    offset_rows: offset,
  });

  if (error) throw error;
  return (data as PublicAlumniProfile[]) ?? [];
}

