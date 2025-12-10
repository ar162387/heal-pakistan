export interface Program {
  id: string;
  title: string;
  summary?: string | null;
  image_url?: string | null;
  key_activities: string[];
  sort_order: number;
  is_published: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicProgram extends Omit<Program, "is_published" | "created_by"> {}
