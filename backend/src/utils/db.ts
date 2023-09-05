import Database from 'better-sqlite3'

export const db = new Database('../data/wiki.db', { fileMustExist: true })

db.pragma('journal_mode = WAL')
