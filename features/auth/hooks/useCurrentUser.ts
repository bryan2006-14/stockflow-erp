"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { authService } from "../services/auth.service";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getUser().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return {
    user,
    loading,
  };
}