import { supabase } from "@/lib/supabaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { logActivity } from "./activity";
import { Program, PublicProgram } from "@/types/programs";

export interface CreateProgramInput {
  title: string;
  summary?: string | null;
  image_url?: string | null;
  key_activities?: string[];
  sort_order?: number;
  is_published?: boolean;
}

export type UpdateProgramInput = Partial<CreateProgramInput>;

const normalizeActivities = (items?: string[]) =>
  (items ?? [])
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

export async function uploadProgramImage(file: File): Promise<string> {
  return uploadImageToCloudinary(file);
}

export async function listPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as Program[]) ?? [];
}

export async function createProgram(input: CreateProgramInput): Promise<Program> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to create programs.");
  }

  const payload = {
    ...input,
    title: input.title.trim(),
    summary: input.summary?.trim() ?? null,
    key_activities: normalizeActivities(input.key_activities),
    sort_order: input.sort_order ?? 0,
    is_published: input.is_published ?? true,
    created_by: userId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("programs").insert(payload).select().single();
  if (error) throw error;

  await logActivity({
    action: "created_program",
    entity: "programs",
    entityId: data.id,
    metadata: { title: data.title },
  });

  return data as Program;
}

export async function updateProgram(id: string, updates: UpdateProgramInput): Promise<Program> {
  const payload = {
    ...updates,
    title: updates.title?.trim() ?? updates.title,
    summary: updates.summary?.trim() ?? updates.summary,
    key_activities: updates.key_activities ? normalizeActivities(updates.key_activities) : undefined,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("programs").update(payload).eq("id", id).select().single();
  if (error) throw error;

  await logActivity({
    action: "updated_program",
    entity: "programs",
    entityId: id,
    metadata: updates,
  });

  return data as Program;
}

export async function deleteProgram(id: string): Promise<void> {
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) throw error;

  await logActivity({
    action: "deleted_program",
    entity: "programs",
    entityId: id,
  });
}

export async function reorderPrograms(order: { id: string; sort_order: number }[]): Promise<void> {
  if (!order.length) return;

  const payload = order.map((item) => ({
    id: item.id,
    sort_order: item.sort_order,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("programs").upsert(payload);
  if (error) throw error;

  await logActivity({
    action: "reordered_programs",
    entity: "programs",
    entityId: order[0].id,
    metadata: { order: order.map((item) => item.id) },
  });
}

export async function fetchPublicPrograms(limit?: number): Promise<PublicProgram[]> {
  let query = supabase
    .from("programs")
    .select("id, title, summary, image_url, key_activities, sort_order, created_at, updated_at")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as PublicProgram[]) ?? [];
}
