import { useState, useEffect, useCallback } from "react";
import { useMealStore } from "../stores/mealStore";
import { insertMeal, getMealsByRange, getLastMeal } from "../services/mealService";
import { today } from "../utils/date";
import type { Meal } from "../types";

export function useMeals() {
  const { todayMeals, setTodayMeals, addMeal: addToStore, lastMeal } = useMealStore();
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { start, end } = today();
    const meals = await getMealsByRange(start, end);
    setTodayMeals(meals);
    setLoading(false);
  }, [setTodayMeals]);

  const addMeal = useCallback(async (meal: Meal) => {
    await insertMeal(meal);
    addToStore(meal);
  }, [addToStore]);

  const getLast = useCallback(async () => {
    const meal = await getLastMeal();
    return meal ?? undefined;
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { todayMeals, loading, refresh, addMeal, lastMeal: getLast };
}
