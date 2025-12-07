export type TeamRole = "founder" | "co-founder" | "cabinet_member" | "chapter_lead" | "collaborator";

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  designation?: string | null;
  university?: string | null;
  photo_url?: string | null;
  description?: string | null;
  is_published: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicTeamMember {
  id: string;
  name: string;
  role: TeamRole;
  designation?: string | null;
  university?: string | null;
  photo_url?: string | null;
  description?: string | null;
  created_at: string;
}
