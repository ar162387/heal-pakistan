import { supabase } from "@/lib/supabaseClient";
import { RecentActivity } from "@/types/admin";

interface LogActivityInput {
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity({ action, entity, entityId, metadata }: LogActivityInput) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const actorId = session?.user?.id;
  if (!actorId) return;

  await supabase.from("recent_activity").insert({
    actor_id: actorId,
    action,
    entity,
    entity_id: entityId ?? null,
    metadata: metadata ?? {},
  });
}

export async function fetchRecentActivity(limit = 10): Promise<RecentActivity[]> {
  const { data, error } = await supabase
    .from("recent_activity")
    .select(
      "id, actor_id, action, entity, entity_id, metadata, created_at, actor:admin_users!recent_activity_actor_id_fkey(name, role)"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

