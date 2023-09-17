import { Request, Response, NextFunction } from 'express'

export const cacheResponse = async (req: Request, res: Response, next: NextFunction) => {
  const oneDayInSeconds = 86_400
  const expiryDate = Date.now() + oneDayInSeconds * 1000
  const expiryDateUTC = new Date(expiryDate).toUTCString()

  res.setHeader('Cache-Control', `public, max-age=${oneDayInSeconds}`) // 86400 seconds = 1 day
  res.setHeader('Expires', expiryDateUTC) // Expires header set to one day from now

  return next()
}
