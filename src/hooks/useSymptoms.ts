import { useState, useEffect, useCallback } from "react";
import { useMealStore } from "../stores/mealStore";
import { insertSymptom, getSymptomsByRange } from "../services/symptomService";
import { today } from "../utils/date";
import type { Symptom } from "../types";

export function useSymptoms() {
  const { recentSymptoms, setRecentSymptoms, addSymptom: addToStore } = useMealStore();
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { start, end } = today();
    const symptoms = await getSymptomsByRange(start, end);
    setRecentSymptoms(symptoms);
    setLoading(false);
  }, [setRecentSymptoms]);

  const addSymptom = useCallback(async (symptom: Symptom) => {
    await insertSymptom(symptom);
    addToStore(symptom);
  }, [addToStore]);

  useEffect(() => { refresh(); }, [refresh]);

  return { recentSymptoms, loading, refresh, addSymptom };
}
