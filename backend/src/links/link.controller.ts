import { Request, Response, NextFunction } from 'express'
import { db } from '../utils/db'
import { Link } from './link.type'

export const getLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageTitleId } = req.params

    const links = db
      .prepare<string>('SELECT * FROM links WHERE from_title_id = ?')
      .all(pageTitleId) as Link[]

    res.json(links)
  } catch (err) {
    next(err)
  }
}

export const getDeepLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageTitleId } = req.params

    const links = db
      .prepare<[string, number]>(
        `WITH RECURSIVE LinkedDocs AS (
        SELECT DISTINCT link_id, from_title_id, to_title_id, to_title, 0 AS depth
        FROM links
        WHERE from_title_id = ?
        UNION ALL
        SELECT l.link_id, l.from_title_id, l.to_title_id, l.to_title, ld.depth + 1
        FROM links l
        JOIN LinkedDocs ld ON l.from_title_id = ld.to_title_id
        WHERE ld.depth < ?)
      SELECT * FROM LinkedDocs;`
      )
      .all(pageTitleId, 1) as Link[]

    res.json(links)
  } catch (err) {
    next(err)
  }
}
