const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("wiki.db");

const initDB = async () => {
  await new Promise((resolve) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION;");
      db.run(
        `
      CREATE TABLE IF NOT EXISTS pages (
        title_id TEXT PRIMARY KEY,
        title TEXT
      );
    `
      );
      db.run(
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
      );
      db.run("COMMIT;", resolve);
    });
  });

  return;
};

const main = async () => {
  await initDB();
};

main();
