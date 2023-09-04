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
