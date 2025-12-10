import { supabase } from "@/lib/supabaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { logActivity } from "./activity";
import { PublicTestimonial, Testimonial, TestimonialCategory } from "@/types/testimonials";

export interface CreateTestimonialInput {
  category: TestimonialCategory;
  name: string;
  quote: string;
  role?: string | null;
  institute?: string | null;
  university?: string | null;
  batch?: string | null;
  photo_url?: string | null;
  is_published?: boolean;
}

export type UpdateTestimonialInput = Partial<CreateTestimonialInput>;

export interface TestimonialFilters {
  search?: string;
  category?: TestimonialCategory;
}

export interface PublicTestimonialFilters {
  category?: TestimonialCategory;
  limit?: number;
}

export async function uploadTestimonialPhoto(file: File): Promise<string> {
  return uploadImageToCloudinary(file);
}

export async function listTestimonials(filters: TestimonialFilters = {}): Promise<Testimonial[]> {
  const { search, category } = filters;
  let query = supabase.from("testimonials").select("*").order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    const like = `%${search}%`;
    query = query.or(
      [
        `name.ilike.${like}`,
        `quote.ilike.${like}`,
        `role.ilike.${like}`,
        `institute.ilike.${like}`,
        `university.ilike.${like}`,
        `batch.ilike.${like}`,
      ].join(",")
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Testimonial[]) ?? [];
}

export async function createTestimonial(input: CreateTestimonialInput): Promise<Testimonial> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to create testimonials.");
  }

  const payload = {
    ...input,
    is_published: input.is_published ?? true,
    created_by: userId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("testimonials").insert(payload).select().single();
  if (error) throw error;

  await logActivity({
    action: "created_testimonial",
    entity: "testimonials",
    entityId: data.id,
    metadata: { name: data.name, category: data.category },
  });

  return data as Testimonial;
}

export async function updateTestimonial(id: string, updates: UpdateTestimonialInput): Promise<Testimonial> {
  const { data, error } = await supabase
    .from("testimonials")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    action: "updated_testimonial",
    entity: "testimonials",
    entityId: id,
    metadata: updates,
  });

  return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;

  await logActivity({
    action: "deleted_testimonial",
    entity: "testimonials",
    entityId: id,
  });
}

export async function fetchPublicTestimonials(filters: PublicTestimonialFilters = {}): Promise<PublicTestimonial[]> {
  const { category, limit } = filters;
  let query = supabase
    .from("testimonials")
    .select("id, category, name, quote, role, institute, university, batch, photo_url, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as PublicTestimonial[]) ?? [];
}
