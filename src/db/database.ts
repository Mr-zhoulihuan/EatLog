import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("eatlog.db");
    await migrate(db);
  }
  return db;
}

async function migrate(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS meal (
      id            TEXT PRIMARY KEY,
      food_name     TEXT NOT NULL,
      photo_uri     TEXT,
      temperature   TEXT,
      taste         TEXT,
      oiliness      TEXT,
      cook_methods  TEXT,
      staple        TEXT,
      drink         TEXT,
      drink_custom  TEXT,
      note          TEXT,
      created_at    INTEGER NOT NULL,
      updated_at    INTEGER NOT NULL,
      synced        INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS symptom (
      id          TEXT PRIMARY KEY,
      meal_id     TEXT,
      start_time  INTEGER NOT NULL,
      end_time    INTEGER,
      type        TEXT NOT NULL,
      severity    INTEGER NOT NULL,
      note        TEXT,
      created_at  INTEGER NOT NULL,
      synced      INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS custom_label (
      id       TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      value    TEXT NOT NULL,
      color    TEXT
    );

    CREATE TABLE IF NOT EXISTS correlation_cache (
      food_name     TEXT NOT NULL,
      symptom_type  TEXT NOT NULL,
      discomfort_index REAL NOT NULL,
      count         INTEGER NOT NULL,
      avg_severity  REAL NOT NULL,
      updated_at    INTEGER NOT NULL,
      PRIMARY KEY (food_name, symptom_type)
    );
  `);
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
