import { create } from "zustand";

type ThemeColor = "green" | "blue" | "orange" | "purple" | "pink";
type ThemeBackground = "light" | "dark";
type Locale = "zh" | "en";

const THEME_COLORS: Record<ThemeColor, { 50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string }> = {
  green: { 50: "#E8F5E9", 100: "#C8E6C9", 200: "#A5D6A7", 300: "#81C784", 400: "#66BB6A", 500: "#4CAF50", 600: "#43A047", 700: "#388E3C", 800: "#2E7D32", 900: "#1B5E20" },
  blue: { 50: "#EFF6FF", 100: "#DBEAFE", 200: "#BFDBFE", 300: "#93C5FD", 400: "#60A5FA", 500: "#3B82F6", 600: "#2563EB", 700: "#1D4ED8", 800: "#1E40AF", 900: "#1E3A8A" },
  orange: { 50: "#FFF7ED", 100: "#FFEDD5", 200: "#FED7AA", 300: "#FDBA74", 400: "#FB923C", 500: "#F97316", 600: "#EA580C", 700: "#C2410C", 800: "#9A3412", 900: "#7C2D12" },
  purple: { 50: "#FAF5FF", 100: "#F3E8FF", 200: "#E9D5FF", 300: "#D8B4FE", 400: "#C084FC", 500: "#A855F7", 600: "#9333EA", 700: "#7E22CE", 800: "#6B21A8", 900: "#581C87" },
  pink: { 50: "#FDF2F8", 100: "#FCE7F3", 200: "#FBCFE8", 300: "#F9A8D4", 400: "#F472B6", 500: "#EC4899", 600: "#DB2777", 700: "#BE185D", 800: "#9D174D", 900: "#831843" },
};

export { THEME_COLORS };
export type { ThemeColor, ThemeBackground, Locale };

interface SettingsState {
  avatarUri: string;
  reminderEnabled: boolean;
  reminderDelay: number;
  themeColor: ThemeColor;
  themeBackground: ThemeBackground;
  themeOpacity: number;
  locale: Locale;
  toggleReminder: () => void;
  setReminderDelay: (h: number) => void;
  setThemeColor: (c: ThemeColor) => void;
  setThemeBackground: (b: ThemeBackground) => void;
  setThemeOpacity: (o: number) => void;
  setLocale: (l: Locale) => void;
  setAvatarUri: (uri: string) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  avatarUri: "",

  setAvatarUri: (avatarUri: string) => set({ avatarUri }),
  reminderEnabled: false,
  reminderDelay: 2,
  themeColor: "green",
  themeBackground: "light",
  themeOpacity: 100,
  locale: "zh",
  toggleReminder: () => set((s) => ({ reminderEnabled: !s.reminderEnabled })),
  setReminderDelay: (reminderDelay) => set({ reminderDelay }),
  setThemeColor: (themeColor) => set({ themeColor }),
  setThemeBackground: (themeBackground) => set({ themeBackground }),
  setThemeOpacity: (themeOpacity) => set({ themeOpacity }),
  setLocale: (locale) => set({ locale }),
  resetSettings: () => set({
    reminderEnabled: false,
    reminderDelay: 2,
    themeColor: "green",
    themeBackground: "light",
    themeOpacity: 100,
    locale: "zh",
    avatarUri: "",
  }),
}));
