export type MembershipType = "member" | "volunteer" | "donor";

export type MembershipStatus = "pending" | "approved" | "rejected";

export interface MembershipApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  organization?: string | null;
  join_as: MembershipType;
  motivation?: string | null;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}
