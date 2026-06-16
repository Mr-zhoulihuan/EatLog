import { getDb } from "../db/database";
import type { Symptom } from "../types";

export async function insertSymptom(symptom: Symptom): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO symptom (id, meal_id, start_time, end_time, type, severity, note, created_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    symptom.id,
    symptom.meal_id ?? null,
    symptom.start_time,
    symptom.end_time ?? null,
    symptom.type,
    symptom.severity,
    symptom.note ?? null,
    symptom.created_at,
    symptom.synced
  );
}

export async function getSymptomsByRange(start: number, end: number): Promise<Symptom[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM symptom WHERE start_time >= ? AND start_time < ? ORDER BY start_time DESC",
    start,
    end
  );
  return rows.map(rowToSymptom);
}

export async function getAllSymptoms(): Promise<Symptom[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>("SELECT * FROM symptom ORDER BY start_time DESC");
  return rows.map(rowToSymptom);
}

function rowToSymptom(row: Record<string, unknown>): Symptom {
  return {
    id: row.id as string,
    meal_id: row.meal_id as string | undefined,
    start_time: row.start_time as number,
    end_time: row.end_time as number | undefined,
    type: row.type as Symptom["type"],
    severity: row.severity as number,
    note: row.note as string | undefined,
    created_at: row.created_at as number,
    synced: row.synced as number,
  };
}
