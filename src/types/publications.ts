export type PublicationType = "article" | "media";
export type PublicationStatus = "draft" | "published";

export interface Publication {
  id: string;
  title: string;
  author: string;
  published_on: string; // ISO date string
  type: PublicationType;
  category: string;
  status: PublicationStatus;
  content: string;
  cover_image_url?: string | null;
  external_url?: string | null;
  is_published: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicPublication
  extends Omit<Publication, "created_by" | "status" | "is_published" | "updated_at"> {}
