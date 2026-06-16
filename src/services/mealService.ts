import { getDb } from "../db/database";
import type { Meal } from "../types";

export async function insertMeal(meal: Meal): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO meal (id, food_name, photo_uri, temperature, taste, oiliness, cook_methods, staple, drink, drink_custom, note, created_at, updated_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    meal.id,
    meal.food_name,
    meal.photo_uri ?? null,
    meal.temperature ?? null,
    meal.taste ?? null,
    meal.oiliness ?? null,
    meal.cook_methods ? JSON.stringify(meal.cook_methods) : null,
    meal.staple ?? null,
    meal.drink ?? null,
    meal.drink_custom ?? null,
    meal.note ?? null,
    meal.created_at,
    meal.updated_at,
    meal.synced
  );
}

export async function getAllMeals(): Promise<Meal[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>("SELECT * FROM meal ORDER BY created_at DESC");
  return rows.map(rowToMeal);
}

export async function getMealsByRange(start: number, end: number): Promise<Meal[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM meal WHERE created_at >= ? AND created_at < ? ORDER BY created_at DESC",
    start,
    end
  );
  return rows.map(rowToMeal);
}

export async function getLastMeal(): Promise<Meal | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Record<string, unknown>>("SELECT * FROM meal ORDER BY created_at DESC LIMIT 1");
  return row ? rowToMeal(row) : null;
}

function rowToMeal(row: Record<string, unknown>): Meal {
  return {
    id: row.id as string,
    food_name: row.food_name as string,
    photo_uri: row.photo_uri as string | undefined,
    temperature: row.temperature as Meal["temperature"],
    taste: row.taste as Meal["taste"],
    oiliness: row.oiliness as Meal["oiliness"],
    cook_methods: row.cook_methods ? JSON.parse(row.cook_methods as string) : undefined,
    staple: row.staple as Meal["staple"],
    drink: row.drink as Meal["drink"],
    drink_custom: row.drink_custom as string | undefined,
    note: row.note as string | undefined,
    created_at: row.created_at as number,
    updated_at: row.updated_at as number,
    synced: row.synced as number,
  };
}
