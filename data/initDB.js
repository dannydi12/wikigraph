const Database = require("better-sqlite3");

const db = new Database("wiki2.db");

const initDB = async () => {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS links (
        from_title_id TEXT,
        to_title_id TEXT,
        to_title TEXT,
        link_id INTEGER PRIMARY KEY AUTOINCREMENT,
        FOREIGN KEY (from_title_id) REFERENCES titles (title_id),
        FOREIGN KEY (to_title_id) REFERENCES titles (title_id),
        UNIQUE (from_title_id, to_title_id) ON CONFLICT REPLACE
    );
    `
  ).run();
};

initDB();
