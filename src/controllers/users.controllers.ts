import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import userServices from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({ msg: 'hello users' })
}

export const registerController = async (req: Request, res: Response) => {
  const isValid = validationResult(req)
  if (isValid.isEmpty()) {
    const data = matchedData(req)
    const { email, password } = data
    try {
      const result = await userServices.register({ email, password })

      return res.json({ msg: 'created user', data: result })
    } catch (error) {
      console.log(error)

      return res.status(400).json({ error })
    }
  }

  return res.status(400).json({ errors: isValid.array() })
}
