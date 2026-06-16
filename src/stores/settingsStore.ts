import { create } from "zustand";

interface SettingsState {
  reminderEnabled: boolean;
  reminderDelay: number; // hours after meal
  toggleReminder: () => void;
  setReminderDelay: (h: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  reminderEnabled: false,
  reminderDelay: 2,
  toggleReminder: () => set((s) => ({ reminderEnabled: !s.reminderEnabled })),
  setReminderDelay: (reminderDelay) => set({ reminderDelay }),
}));
