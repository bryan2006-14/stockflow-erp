import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/inventory";

const supabase = createClient();

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;

    return data as Category[];
  },

  async create(category: Omit<Category, "id" | "created_at">) {
    const { error } = await supabase
      .from("categories")
      .insert(category);

    if (error) throw error;
  },

  async update(id: string, values: Partial<Category>) {
    const { error } = await supabase
      .from("categories")
      .update(values)
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};