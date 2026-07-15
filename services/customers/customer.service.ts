import { createClient } from "@/lib/supabase/client";
import { Customer } from "@/types/inventory";

const supabase = createClient();

export type CreateCustomerInput = Omit<
  Customer,
  "id" | "created_at" | "updated_at"
>;

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []) as Customer[];
  },

  async create(customer: CreateCustomerInput): Promise<void> {
    const { error } = await supabase
      .from("customers")
      .insert(customer);

    if (error) throw error;
  },

  async update(
    id: string,
    values: Partial<CreateCustomerInput>
  ): Promise<void> {
    const { error } = await supabase
      .from("customers")
      .update({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};