import { createClient } from "@/lib/supabase/client";

export interface CompanySettings {
  id: string;
  name: string;
  ruc: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string | null;
}

export interface UpdateCompanySettingsInput {
  name: string;
  ruc: string;
  email: string;
  phone: string;
  address: string;
}

interface ProfileCompany {
  company_id: string | null;
}

interface CompanyRow {
  id: string;
  name: string;
  ruc: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
}

async function getCurrentCompanyId(): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("No existe una sesión activa.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single<ProfileCompany>();

  if (profileError) {
    throw profileError;
  }

  if (!profile?.company_id) {
    throw new Error("El usuario no tiene una empresa asignada.");
  }

  return profile.company_id;
}

export const companySettingsService = {
  async getCompany(): Promise<CompanySettings> {
    const supabase = createClient();
    const companyId = await getCurrentCompanyId();

    const { data, error } = await supabase
      .from("companies")
      .select(`
        id,
        name,
        ruc,
        email,
        phone,
        address,
        logo_url
      `)
      .eq("id", companyId)
      .single<CompanyRow>();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      ruc: data.ruc ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",
      logoUrl: data.logo_url,
    };
  },

  async updateCompany(
    input: UpdateCompanySettingsInput
  ): Promise<CompanySettings> {
    const supabase = createClient();
    const companyId = await getCurrentCompanyId();

    const normalizedInput = {
      name: input.name.trim(),
      ruc: input.ruc.trim() || null,
      email: input.email.trim() || null,
      phone: input.phone.trim() || null,
      address: input.address.trim() || null,
    };

    const { data, error } = await supabase
      .from("companies")
      .update(normalizedInput)
      .eq("id", companyId)
      .select(`
        id,
        name,
        ruc,
        email,
        phone,
        address,
        logo_url
      `)
      .single<CompanyRow>();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      ruc: data.ruc ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",
      logoUrl: data.logo_url,
    };
  },
};