"use client";

import { useEffect, useState } from "react";
import {
  Profile,
  profileService,
} from "@/services/profile/profile.service";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      const data = await profileService.me();
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    reload: loadProfile,
  };
}