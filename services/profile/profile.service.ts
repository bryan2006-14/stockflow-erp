import { createClient } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  company_id: string | null;
  full_name: string;
  role: string;
  avatar_url: string | null;
}

const supabase = createClient();

export const profileService = {
  async me(): Promise<Profile | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, company_id, full_name, role, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    return data as Profile;
  },
};