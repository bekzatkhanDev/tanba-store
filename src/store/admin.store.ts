"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

type AdminState = {
  admin: any | null;
  loading: boolean;
  isSidebarOpen: boolean;

  loadAdmin: () => void;
  toggleSidebar: () => void;
  logout: () => Promise<void>;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  admin: null,
  loading: true,
  isSidebarOpen: true,

  loadAdmin: async () => {
    const { data } = await supabase.auth.getUser();

    // admin email можно вынести в env
    const allowedAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (data.user && data.user.email === allowedAdminEmail) {
      set({ admin: data.user, loading: false });
    } else {
      set({ admin: null, loading: false });
    }
  },

  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ admin: null });
  }
}));
