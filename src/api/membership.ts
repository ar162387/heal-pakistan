import { supabase } from "@/lib/supabaseClient";
import { logActivity } from "./activity";
import { MembershipApplication, MembershipStatus, MembershipType } from "@/types/membership";

export interface CreateMembershipInput {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  organization?: string;
  join_as: MembershipType;
  motivation?: string;
}

export interface MembershipFilters {
  search?: string;
  status?: MembershipStatus | "all";
  join_as?: MembershipType | "all";
}

export async function createMembershipApplication(input: CreateMembershipInput): Promise<void> {
  const payload = {
    ...input,
    organization: input.organization?.trim() || null,
    motivation: input.motivation?.trim() || null,
    full_name: input.full_name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    city: input.city.trim(),
    status: "pending" as MembershipStatus,
    created_by: (await supabase.auth.getSession()).data.session?.user?.id ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("membership_applications").insert(payload, { returning: "minimal" });
  if (error) throw error;
}

export async function listMembershipApplications(filters: MembershipFilters = {}): Promise<MembershipApplication[]> {
  const { search, status, join_as } = filters;
  let query = supabase.from("membership_applications").select("*").order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (join_as && join_as !== "all") {
    query = query.eq("join_as", join_as);
  }

  if (search) {
    const like = `%${search}%`;
    query = query.or(
      [
        `full_name.ilike.${like}`,
        `email.ilike.${like}`,
        `phone.ilike.${like}`,
        `city.ilike.${like}`,
        `organization.ilike.${like}`,
        `motivation.ilike.${like}`,
      ].join(",")
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as MembershipApplication[]) ?? [];
}

export async function updateMembershipStatus(id: string, status: MembershipStatus): Promise<MembershipApplication> {
  const { data, error } = await supabase
    .from("membership_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await logActivity({
    action: `membership_${status}`,
    entity: "membership_applications",
    entityId: id,
    metadata: { status },
  });

  return data as MembershipApplication;
}
