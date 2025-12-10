import { supabase } from "@/lib/supabaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { logActivity } from "./activity";
import { Publication, PublicPublication, PublicationStatus, PublicationType } from "@/types/publications";

export interface PublicationsFilters {
  search?: string;
  type?: PublicationType;
  status?: PublicationStatus;
  category?: string;
  author?: string;
}

export interface PublicPublicationsFilters {
  search?: string;
  type?: PublicationType;
  category?: string;
  author?: string;
  limit?: number;
}

export interface CreatePublicationInput {
  title: string;
  author: string;
  published_on: string;
  type: PublicationType;
  category: string;
  status?: PublicationStatus;
  content: string;
  cover_image_url?: string | null;
  external_url?: string | null;
  is_published?: boolean;
}

export type UpdatePublicationInput = Partial<CreatePublicationInput>;

export async function uploadPublicationImage(file: File): Promise<string> {
  return uploadImageToCloudinary(file);
}

export async function listPublications(filters: PublicationsFilters = {}): Promise<Publication[]> {
  const { search, type, status, category, author } = filters;

  let query = supabase
    .from("publications")
    .select("*")
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (search) {
    const like = `%${search}%`;
    query = query.or(`title.ilike.${like},author.ilike.${like},content.ilike.${like}`);
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (author) {
    query = query.eq("author", author);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Publication[]) ?? [];
}

export async function createPublication(input: CreatePublicationInput): Promise<Publication> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to create publications.");
  }

  const payload = {
    ...input,
    status: input.status ?? "draft",
    is_published: input.is_published ?? input.status === "published",
    created_by: userId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("publications").insert(payload).select().single();
  if (error) throw error;

  await logActivity({
    action: "created_publication",
    entity: "publications",
    entityId: data.id,
    metadata: { title: data.title, type: data.type, status: data.status },
  });

  return data as Publication;
}

export async function updatePublication(id: string, updates: UpdatePublicationInput): Promise<Publication> {
  const payload = {
    ...updates,
    status: updates.status ?? undefined,
    is_published:
      updates.is_published ?? (updates.status ? updates.status === "published" : undefined),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("publications").update(payload).eq("id", id).select().single();
  if (error) throw error;

  await logActivity({
    action: "updated_publication",
    entity: "publications",
    entityId: id,
    metadata: updates,
  });

  return data as Publication;
}

export async function deletePublication(id: string): Promise<void> {
  const { error } = await supabase.from("publications").delete().eq("id", id);
  if (error) throw error;

  await logActivity({
    action: "deleted_publication",
    entity: "publications",
    entityId: id,
  });
}

export async function fetchPublicPublications(limit = 20): Promise<PublicPublication[]> {
  return fetchFilteredPublicPublications({ limit });
}

export async function fetchFilteredPublicPublications(
  filters: PublicPublicationsFilters = {},
): Promise<PublicPublication[]> {
  const { search, type, category, author, limit = 50 } = filters;

  let query = supabase
    .from("publications")
    .select(
      "id, title, author, published_on, type, category, content, cover_image_url, external_url, created_at",
    )
    .eq("is_published", true)
    .eq("status", "published")
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (author) {
    query = query.eq("author", author);
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;
  return (data as PublicPublication[]) ?? [];
}

export async function fetchPublicPublicationFilters(): Promise<{
  categories: string[];
  authors: string[];
}> {
  const { data, error } = await supabase
    .from("publications")
    .select("category, author")
    .eq("is_published", true)
    .eq("status", "published")
    .not("category", "is", null)
    .not("author", "is", null)
    .limit(1000);

  if (error) throw error;

  const categories = new Set<string>();
  const authors = new Set<string>();

  (data ?? []).forEach((row) => {
    if (row.category) categories.add(row.category);
    if (row.author) authors.add(row.author);
  });

  return {
    categories: Array.from(categories).sort(),
    authors: Array.from(authors).sort(),
  };
}

export async function fetchPublicationFilters(): Promise<{
  categories: string[];
  authors: string[];
}> {
  const { data, error } = await supabase
    .from("publications")
    .select("category, author")
    .not("category", "is", null)
    .not("author", "is", null)
    .limit(1000);

  if (error) throw error;

  const categories = new Set<string>();
  const authors = new Set<string>();

  (data ?? []).forEach((row) => {
    if (row.category) categories.add(row.category);
    if (row.author) authors.add(row.author);
  });

  return {
    categories: Array.from(categories).sort(),
    authors: Array.from(authors).sort(),
  };
}

export async function fetchPublicPublication(id: string): Promise<PublicPublication | null> {
  const { data, error } = await supabase
    .from("publications")
    .select("id, title, author, published_on, type, category, content, cover_image_url, external_url, created_at")
    .eq("is_published", true)
    .eq("status", "published")
    .eq("id", id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error;
  return (data as PublicPublication) ?? null;
}
