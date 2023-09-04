import { Request, Response, NextFunction } from 'express'

export const getPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
   

    res.json()
  } catch (err) {
    next(err)
  }
}
