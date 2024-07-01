import { NextFunction, Request, Response } from 'express'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ msg: 'Missing username or password' })
  }
  next()
}
