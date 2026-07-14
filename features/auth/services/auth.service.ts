import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const authService = {
  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  },
};