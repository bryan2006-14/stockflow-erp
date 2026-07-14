import { createClient } from "@/lib/supabase/client";
import { Brand } from "@/types/inventory";

const supabase = createClient();

export const brandService = {
  async getAll(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name");

    if (error) throw error;

    return data as Brand[];
  },

  async create(brand: Omit<Brand, "id" | "created_at">) {
    const { error } = await supabase.from("brands").insert(brand);

    if (error) throw error;
  },

  async update(id: string, values: Partial<Brand>) {
    const { error } = await supabase
      .from("brands")
      .update(values)
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (error) throw error;
  },
};