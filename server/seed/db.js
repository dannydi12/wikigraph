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
        link_id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_title_id TEXT,
        to_title_id TEXT,
        to_title TEXT,
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

let docCount = 0;
const processData = async (data) => {
  await new Promise((resolve) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION;");

      // Loop through your items and insert them one by one
      db.run("INSERT OR REPLACE INTO pages (title_id, title) VALUES (?, ?)", [
        data.title.toLowerCase(),
        data.title,
      ]);

      docCount++;

      if (data.linksTo) {
        for (const link of data.linksTo) {
          db.run(
            "INSERT OR REPLACE INTO pages (title_id, title) VALUES (?, ?)",
            [link.toLowerCase(), link]
          );
          db.run(
            "INSERT OR REPLACE INTO links (from_title_id, to_title_id, to_title) VALUES (?, ?, ?)",
            [data.title.toLowerCase(), link.toLowerCase(), link]
          );
        }
      }
      console.log("Docs:", docCount);
      db.run("COMMIT;", resolve);
    });
  });
};

module.exports = { processData, initDB };
