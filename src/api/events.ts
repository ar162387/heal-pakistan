import { supabase } from "@/lib/supabaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { logActivity } from "./activity";
import { Event, EventGalleryImage, PublicEvent } from "@/types/events";

export interface CreateEventInput {
  title: string;
  description: string;
  location?: string;
  starts_at: string;
  ends_at?: string | null;
  hero_image_url?: string | null;
  is_featured?: boolean;
  is_published?: boolean;
  slug?: string;
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface PublicEventsFilters {
  featuredOnly?: boolean;
  limit?: number;
}

const slugify = (value: string) => {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (base) return base;
  const fallback = Math.random().toString(36).slice(2, 8);
  return `event-${fallback}`;
};

export async function uploadEventImage(file: File): Promise<string> {
  return uploadImageToCloudinary(file);
}

export async function listEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*, gallery:event_gallery_images(*)")
    .order("starts_at", { ascending: false });

  if (error) throw error;
  return (data as Event[]) ?? [];
}

export async function createEvent(input: CreateEventInput, galleryUrls: string[] = []): Promise<Event> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("You must be signed in to create events.");
  }

  const payload = {
    ...input,
    slug: input.slug ? slugify(input.slug) : slugify(input.title),
    is_featured: input.is_featured ?? false,
    is_published: input.is_published ?? true,
    created_by: userId,
    updated_at: new Date().toISOString(),
  };

  const { data: created, error } = await supabase.from("events").insert(payload).select().single();
  if (error) throw error;

  if (galleryUrls.length) {
    const galleryPayload = galleryUrls.map((url, index) => ({
      event_id: created.id as string,
      image_url: url,
      sort_order: index,
    }));

    const { error: galleryError } = await supabase.from("event_gallery_images").insert(galleryPayload);
    if (galleryError) throw galleryError;
  }

  await logActivity({
    action: "created_event",
    entity: "events",
    entityId: created.id,
    metadata: { title: created.title, starts_at: created.starts_at, location: created.location },
  });

  const { data: fullEvent, error: fetchError } = await supabase
    .from("events")
    .select("*, gallery:event_gallery_images(*)")
    .eq("id", created.id)
    .single();

  if (fetchError) throw fetchError;
  return fullEvent as Event;
}

export async function updateEvent(
  id: string,
  updates: UpdateEventInput,
  newGalleryUrls: string[] = []
): Promise<Event> {
  const updatePayload = {
    ...updates,
    slug: updates.slug ? slugify(updates.slug) : updates.slug,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("events").update(updatePayload).eq("id", id).select().single();
  if (error) throw error;

  if (newGalleryUrls.length) {
    const galleryPayload = newGalleryUrls.map((url, index) => ({
      event_id: id,
      image_url: url,
      sort_order: index,
    }));

    const { error: galleryError } = await supabase.from("event_gallery_images").insert(galleryPayload);
    if (galleryError) throw galleryError;
  }

  await logActivity({
    action: "updated_event",
    entity: "events",
    entityId: id,
    metadata: updates,
  });

  const { data: fullEvent, error: fetchError } = await supabase
    .from("events")
    .select("*, gallery:event_gallery_images(*)")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;
  return fullEvent as Event;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;

  await logActivity({
    action: "deleted_event",
    entity: "events",
    entityId: id,
  });
}

export async function addEventGalleryImages(eventId: string, imageUrls: string[]): Promise<EventGalleryImage[]> {
  if (!imageUrls.length) return [];

  const payload = imageUrls.map((url, index) => ({
    event_id: eventId,
    image_url: url,
    sort_order: index,
  }));

  const { data, error } = await supabase.from("event_gallery_images").insert(payload).select();
  if (error) throw error;
  return (data as EventGalleryImage[]) ?? [];
}

export async function removeEventGalleryImage(imageId: string): Promise<void> {
  const { error } = await supabase.from("event_gallery_images").delete().eq("id", imageId);
  if (error) throw error;
}

export async function fetchPublicEvents(filters: PublicEventsFilters = {}): Promise<PublicEvent[]> {
  const { featuredOnly = false, limit } = filters;

  let query = supabase
    .from("events")
    .select("id, slug, title, description, location, starts_at, ends_at, hero_image_url, is_featured, created_at, gallery:event_gallery_images(id, image_url, sort_order)")
    .eq("is_published", true)
    .order("starts_at", { ascending: true });

  if (featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as PublicEvent[]) ?? [];
}

export async function fetchPublicEvent(identifier: string): Promise<PublicEvent | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  let query = supabase
    .from("events")
    .select(
      "id, slug, title, description, location, starts_at, ends_at, hero_image_url, is_featured, created_at, gallery:event_gallery_images(*)"
    )
    .eq("is_published", true);

  if (isUuid) {
    query = query.or(`id.eq.${identifier},slug.eq.${identifier}`);
  } else {
    query = query.eq("slug", identifier);
  }

  const { data, error } = await query.maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return (data as PublicEvent) ?? null;
}
