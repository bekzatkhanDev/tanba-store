"use client";

import { useEffect } from "react";
import { supabase } from "../supabase/client";
import { useRouter } from "next/navigation";

export const useAuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      }
    });
  }, [router]);
};
