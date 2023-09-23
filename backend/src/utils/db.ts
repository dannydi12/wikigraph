import Database from 'better-sqlite3'

export const db = new Database(process.env.DB_FILE, { fileMustExist: true })

// for better performance: 
// https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md#performance
db.pragma('journal_mode = WAL')
