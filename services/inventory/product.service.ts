import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/inventory";

const supabase = createClient();

export const productService = {
  async getAll(): Promise<any[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      brands(name),
      units(name, abbreviation)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
},

  async create(product: Omit<Product, "id" | "created_at">) {
    const { error } = await supabase.from("products").insert(product);

    if (error) throw error;
  },

  async update(id: string, values: Partial<Product>) {
    const { error } = await supabase
      .from("products")
      .update(values)
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  },
};