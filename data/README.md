# Getting Setup
- Download pages multistream torrent from [metawiki site](https://meta.wikimedia.org/wiki/Data_dump_torrents#English_Wikipedia)
	- [More info](https://en.wikipedia.org/wiki/Wikipedia:Database_download#E-book)
- Then run `node convertcsv`
- Then run `node initDB` to build the database file
- Then  run `sqlite3 wiki.db`
  - `.import pages.csv pages`
  - `.import links.csv links`
  - run `CREATE INDEX idx_from_title_id ON links (from_title_id);`