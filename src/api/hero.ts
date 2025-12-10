import { supabase } from "@/lib/supabaseClient";
import { uploadMediaToCloudinary } from "@/lib/cloudinary";

export type HeroMediaType = "image" | "video";

export interface HeroSlide {
  id: string;
  media_url: string;
  media_type: HeroMediaType;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateHeroSlideInput {
  media_url: string;
  media_type: HeroMediaType;
  sort_order?: number;
}

export async function uploadHeroMedia(file: File): Promise<string> {
  return uploadMediaToCloudinary(file);
}

export async function listHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as HeroSlide[]) ?? [];
}

export async function createHeroSlide(input: CreateHeroSlideInput): Promise<HeroSlide> {
  const { data, error } = await supabase
    .from("hero_slides")
    .insert({ ...input, is_active: true })
    .select()
    .single();

  if (error) throw error;
  return data as HeroSlide;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw error;
}

export async function updateHeroSlide(id: string, updates: Partial<CreateHeroSlideInput>): Promise<HeroSlide> {
  const { data, error } = await supabase.from("hero_slides").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as HeroSlide;
}
