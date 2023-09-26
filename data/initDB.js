const Database = require("better-sqlite3");

const db = new Database("wiki.db");

const initDB = async () => {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS links (
        from_title_id TEXT,
        to_title_id TEXT,
        to_title TEXT,
        link_id INTEGER PRIMARY KEY AUTOINCREMENT,
        UNIQUE (from_title_id, to_title_id) ON CONFLICT REPLACE
    );
    `
  ).run();
};

initDB();
