import { supabase } from "@/lib/supabaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { SiteSettings } from "@/types/settings";

const SETTINGS_ID = "default";

export type UpdateSiteSettingsInput = Partial<Omit<SiteSettings, "id" | "updated_at" | "updated_by">>;

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", SETTINGS_ID).maybeSingle();
  if (error) throw error;
  return data as SiteSettings | null;
}

export async function upsertSiteSettings(input: UpdateSiteSettingsInput): Promise<SiteSettings> {
  const payload = {
    id: SETTINGS_ID,
    ...input,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("site_settings").upsert(payload).select().single();
  if (error) throw error;
  return data as SiteSettings;
}

export async function uploadSiteLogo(file: File): Promise<string> {
  return uploadImageToCloudinary(file);
}
