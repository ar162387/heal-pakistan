export type EventStatus = "upcoming" | "past";

export interface EventGalleryImage {
  id: string;
  event_id: string;
  image_url: string;
  caption?: string | null;
  sort_order: number;
  created_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  location?: string | null;
  starts_at: string;
  ends_at?: string | null;
  hero_image_url?: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  gallery?: EventGalleryImage[];
}

export interface PublicEvent extends Omit<Event, "created_by" | "is_published" | "updated_at"> {}
