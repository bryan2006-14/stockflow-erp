"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CompanySettings,
  UpdateCompanySettingsInput,
  companySettingsService,
} from "@/services/settings/company-settings.service";

export function useCompanySettings() {
  const [company, setCompany] =
    useState<CompanySettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCompany = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const companyData =
        await companySettingsService.getCompany();

      setCompany(companyData);
    } catch (requestError) {
      console.error(
        "Error loading company settings:",
        requestError
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cargar la empresa."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(
    async (input: UpdateCompanySettingsInput) => {
      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        const updatedCompany =
          await companySettingsService.updateCompany(input);

        setCompany(updatedCompany);
        setSuccess(
          "La información de la empresa se guardó correctamente."
        );

        return true;
      } catch (requestError) {
        console.error(
          "Error updating company settings:",
          requestError
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudieron guardar los cambios."
        );

        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  useEffect(() => {
    void loadCompany();
  }, [loadCompany]);

  return {
    company,
    loading,
    saving,
    error,
    success,
    reload: loadCompany,
    updateCompany,
    clearMessages,
  };
}