import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'profiles.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id              TEXT    PRIMARY KEY,
      title           TEXT    NOT NULL,
      first           TEXT    NOT NULL,
      last            TEXT    NOT NULL,
      gender          TEXT    NOT NULL,
      email           TEXT    NOT NULL,
      phone           TEXT    NOT NULL,
      country         TEXT    NOT NULL,
      city            TEXT    NOT NULL,
      state           TEXT    NOT NULL,
      street_number   INTEGER NOT NULL,
      street_name     TEXT    NOT NULL,
      age             INTEGER NOT NULL,
      dob_date        TEXT    NOT NULL,
      picture_large   TEXT    NOT NULL,
      picture_thumbnail TEXT  NOT NULL,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
}
