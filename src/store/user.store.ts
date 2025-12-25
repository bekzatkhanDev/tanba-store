"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

type UserState = {
  user: any | null;
  loading: boolean;
  loadUser: () => void;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,

  loadUser: async () => {
    const { data } = await supabase.auth.getUser();
    set({ user: data.user, loading: false });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}));
