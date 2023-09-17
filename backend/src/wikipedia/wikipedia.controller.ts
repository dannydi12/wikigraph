import { Request, Response, NextFunction } from 'express'
import { WikiSearch } from './wikipedia.type'
import axios from 'axios'

export const searchWikipedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query

    const { data } = await axios<WikiSearch>({
      url: "https://en.wikipedia.org/w/api.php",
      params: {
        action: "query",
        format: "json",
        list: "search",
        srsearch: search,
      },
    });

    res.json(data)
  } catch (err) {
    next(err)
  }
}