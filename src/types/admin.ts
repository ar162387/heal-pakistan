export type AdminRole = "super_admin" | "content_manager" | "member";

export type AdminStatus = "active" | "inactive" | "suspended";

export interface AdminUser {
  user_id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  last_login: string | null;
  created_at: string;
}

export interface RecentActivity {
  id: number;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  actor?: {
    name: string | null;
    role: AdminRole | null;
  } | null;
}

