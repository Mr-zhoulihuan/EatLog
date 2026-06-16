import { getDb } from "../db/database";
import { CORRELATION_WINDOW_MS } from "../utils/date";
import type { Meal, Symptom } from "../types";

interface DiscomfortItem {
  food_name: string;
  symptom_type: string;
  count: number;
  avg_severity: number;
  discomfort_index: number;
}

export async function calculateCorrelations(): Promise<void> {
  const db = await getDb();

  const meals = await db.getAllAsync<Record<string, unknown>>("SELECT * FROM meal ORDER BY created_at ASC");
  const symptoms = await db.getAllAsync<Record<string, unknown>>("SELECT * FROM symptom ORDER BY start_time ASC");

  const results = new Map<string, { count: number; severities: number[]; recentCount: number }>();
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 86400000;

  for (const meal of meals) {
    const mealTime = meal.created_at as number;
    const foodName = meal.food_name as string;
    const windowStart = mealTime + CORRELATION_WINDOW_MS.min;
    const windowEnd = mealTime + CORRELATION_WINDOW_MS.max;

    for (const symptom of symptoms) {
      const symptomTime = symptom.start_time as number;
      if (symptomTime >= windowStart && symptomTime <= windowEnd) {
        const key = `${foodName}|${symptom.type}`;
        const existing = results.get(key) ?? { count: 0, severities: [], recentCount: 0 };
        existing.count++;
        existing.severities.push(symptom.severity as number);
        if (symptomTime > thirtyDaysAgo) {
          existing.recentCount++;
        }
        results.set(key, existing);
      }
    }
  }

  await db.runAsync("DELETE FROM correlation_cache");

  const insertStmt = await db.prepareAsync(
    "INSERT INTO correlation_cache (food_name, symptom_type, discomfort_index, count, avg_severity, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  );

  for (const [key, data] of results) {
    const [foodName, symptomType] = key.split("|");
    const avgSeverity = data.severities.reduce((a, b) => a + b, 0) / data.severities.length;
    const recentFactor = 1 + (data.recentCount / data.count) * 0.5;
    const discomfortIndex = Math.log(data.count + 1) * avgSeverity * recentFactor;

    await insertStmt.executeAsync(foodName, symptomType, discomfortIndex, data.count, avgSeverity, now);
  }

  await insertStmt.finalizeAsync();
}

export async function getCorrelationResults(): Promise<DiscomfortItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM correlation_cache ORDER BY discomfort_index DESC LIMIT 20"
  );
  return rows.map((r) => ({
    food_name: r.food_name as string,
    symptom_type: r.symptom_type as string,
    count: r.count as number,
    avg_severity: r.avg_severity as number,
    discomfort_index: r.discomfort_index as number,
  }));
}
