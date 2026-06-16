import { useState, useCallback } from "react";
import { calculateCorrelations, getCorrelationResults } from "../services/correlationService";

interface DiscomfortItem {
  food_name: string;
  symptom_type: string;
  count: number;
  avg_severity: number;
  discomfort_index: number;
}

export function useCorrelation() {
  const [results, setResults] = useState<DiscomfortItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    await calculateCorrelations();
    const items = await getCorrelationResults();
    setResults(items);
    setLoading(false);
  }, []);

  return { results, loading, refresh };
}
