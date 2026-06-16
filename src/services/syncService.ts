import { getDb } from "../db/database";

export async function syncPending(): Promise<void> {
  const db = await getDb();
  const pendingMeals = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM meal WHERE synced = 0"
  );
  const pendingSymptoms = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM symptom WHERE synced = 0"
  );

  // Firebase sync will be implemented when cloud is set up
  // For now, just mark as synced locally
  if (pendingMeals.length > 0) {
    await db.runAsync("UPDATE meal SET synced = 1 WHERE synced = 0");
  }
  if (pendingSymptoms.length > 0) {
    await db.runAsync("UPDATE symptom SET synced = 1 WHERE synced = 0");
  }
}
