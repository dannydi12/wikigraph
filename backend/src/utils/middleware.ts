import { Request, Response, NextFunction } from 'express'

export const myMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // if (!req.session.user) {
  //   return next()
  // }

  // // TODO: would be nice to make a redis call
  // req.user = req.session.user

  return next()
}