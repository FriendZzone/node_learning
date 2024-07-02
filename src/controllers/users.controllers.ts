import { Request, Response } from 'express'
import userServices from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({ msg: 'hello users' })
}

export const registerController = (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = userServices.register({ email, password })

    return res.json({ msg: 'created user', data: result })
  } catch (error) {
    console.log(error)

    return res.status(400).json({ error })
  }
}
