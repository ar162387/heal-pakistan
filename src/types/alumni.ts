export interface AlumniProfile {
  id: string;
  full_name: string;
  university: string;
  batch: string;
  bio?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  profile_photo_url?: string | null;
  is_published: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicAlumniProfile {
  id: string;
  full_name: string;
  university: string;
  batch: string;
  bio?: string | null;
  profile_photo_url?: string | null;
  created_at: string;
}

