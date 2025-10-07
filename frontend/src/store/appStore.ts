import { create } from "zustand";

interface AppState {
  language: "es" | "en" | "pt";
  sidebarOpen: boolean;
  currentView: "dashboard" | "projects" | "trainings" | "profile";
  isLoading: boolean;

  // Actions
  setLanguage: (language: "es" | "en" | "pt") => void;
  toggleSidebar: () => void;
  setCurrentView: (
    view: "dashboard" | "projects" | "trainings" | "profile"
  ) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: "es",
  sidebarOpen: true,
  currentView: "dashboard",
  isLoading: false,

  setLanguage: (language) => {
    set({ language });
    // Here you would also update i18n language
    if (typeof window !== "undefined") {
      import("../lib/i18n").then((i18n) => {
        i18n.default.changeLanguage(language);
      });
    }
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setCurrentView: (view) => {
    set({ currentView: view });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
