const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

function getDbPath() {
  const userData = app.getPath('userData');
  return path.join(userData, 'morning-notes.db');
}

let db = null;

function getDb() {
  if (!db) {
    db = new Database(getDbPath());
    db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        thankful TEXT NOT NULL,
        excited TEXT NOT NULL,
        important TEXT NOT NULL,
        algebra_solved INTEGER DEFAULT 0,
        algebra_skipped INTEGER DEFAULT 0,
        quote TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return db;
}

function saveEntry(entry) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO entries (date, thankful, excited, important, algebra_solved, algebra_skipped, quote)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const date = new Date().toISOString().split('T')[0];
  stmt.run(
    date,
    entry.thankful,
    entry.excited,
    entry.important,
    entry.algebraSolved ? 1 : 0,
    entry.algebraSkipped ? 1 : 0,
    entry.quote || null
  );
}

function getEntries() {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM entries ORDER BY created_at DESC LIMIT 100
  `);
  return stmt.all();
}

module.exports = { saveEntry, getEntries };
