import { create } from "zustand";
import type { Meal, Symptom } from "../types";

interface MealState {
  meals: Meal[];
  symptoms: Symptom[];
  todayMeals: Meal[];
  recentSymptoms: Symptom[];
  isLoading: boolean;
  setMeals: (meals: Meal[]) => void;
  setSymptoms: (symptoms: Symptom[]) => void;
  setTodayMeals: (meals: Meal[]) => void;
  setRecentSymptoms: (symptoms: Symptom[]) => void;
  setLoading: (v: boolean) => void;
  addMeal: (meal: Meal) => void;
  addSymptom: (symptom: Symptom) => void;
  lastMeal: () => Meal | undefined;
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  symptoms: [],
  todayMeals: [],
  recentSymptoms: [],
  isLoading: true,
  setMeals: (meals) => set({ meals }),
  setSymptoms: (symptoms) => set({ symptoms }),
  setTodayMeals: (meals) => set({ todayMeals: meals }),
  setRecentSymptoms: (symptoms) => set({ recentSymptoms: symptoms }),
  setLoading: (isLoading) => set({ isLoading }),
  addMeal: (meal) => set((s) => ({ meals: [meal, ...s.meals], todayMeals: [meal, ...s.todayMeals] })),
  addSymptom: (symptom) => set((s) => ({ symptoms: [symptom, ...s.symptoms], recentSymptoms: [symptom, ...s.recentSymptoms] })),
  lastMeal: () => {
    const { meals } = get();
    return meals.length > 0 ? meals[0] : undefined;
  },
}));
