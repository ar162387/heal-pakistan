import { supabase } from "@/lib/supabaseClient";
import { ContactMessage, MessageStatus } from "@/types/messages";

export interface CreateMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MessageFilters {
  status?: MessageStatus | "all";
  search?: string;
}

export async function createMessage(input: CreateMessageInput): Promise<void> {
  const payload = {
    ...input,
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: "new" as MessageStatus,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("contact_messages").insert(payload, { returning: "minimal" });
  if (error) throw error;
}

export async function listMessages(filters: MessageFilters = {}): Promise<ContactMessage[]> {
  const { status, search } = filters;
  let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    const like = `%${search}%`;
    query = query.or(
      ["name.ilike." + like, "email.ilike." + like, "subject.ilike." + like, "message.ilike." + like].join(",")
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as ContactMessage[]) ?? [];
}

export async function updateMessageStatus(id: string, status: MessageStatus): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ContactMessage;
}
