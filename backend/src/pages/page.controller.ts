import { Request, Response, NextFunction } from 'express'
import { db } from '../utils/db'
import { Page } from './page.type'

export const getPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageTitleId } = req.params

    const pages = db
      .prepare<string>('SELECT * FROM pages WHERE title_id = ?')
      .get(pageTitleId) as Page[]

    res.json(pages)
  } catch (err) {
    next(err)
  }
}
