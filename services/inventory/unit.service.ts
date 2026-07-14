import { createClient } from "@/lib/supabase/client";
import { Unit } from "@/types/inventory";

const supabase = createClient();

export const unitService = {
  async getAll(): Promise<Unit[]> {
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .order("name");

    if (error) throw error;

    return data as Unit[];
  },

  async create(unit: Omit<Unit, "id" | "created_at">) {
    const { error } = await supabase.from("units").insert(unit);

    if (error) throw error;
  },

  async update(id: string, values: Partial<Unit>) {
    const { error } = await supabase
      .from("units")
      .update(values)
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase.from("units").delete().eq("id", id);

    if (error) throw error;
  },
};