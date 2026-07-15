import { createClient } from "@/lib/supabase/client";
import { Supplier } from "@/types/inventory";

const supabase = createClient();

export type CreateSupplierInput = Omit<
  Supplier,
  "id" | "created_at" | "updated_at"
>;

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []) as Supplier[];
  },

  async create(values: CreateSupplierInput): Promise<void> {
    const { error } = await supabase
      .from("suppliers")
      .insert(values);

    if (error) throw error;
  },

  async update(
    id: string,
    values: Partial<CreateSupplierInput>
  ): Promise<void> {
    const { error } = await supabase
      .from("suppliers")
      .update({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("suppliers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};