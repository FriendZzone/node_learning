import { NextFunction, Request, Response } from 'express'

// middleware that is specific to this router
export const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Time: \x1b[32m${new Date().toISOString()}\x1b[0m`)
  next()
}
