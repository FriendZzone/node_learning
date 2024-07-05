import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { matchedData, validationResult } from 'express-validator'
import { RegisterReqBody } from '~/models/requests/User.requests'
import userServices from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({ msg: 'hello users' })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const isValid = validationResult(req)
  if (isValid.isEmpty()) {
    const data = matchedData(req)
    const { email, password, name, date_of_birth } = data
    const result = await userServices.register({ email, password, name, date_of_birth })

    return res.json({ msg: 'created user', data: result })
  }

  return res.status(400).json({ errors: isValid.array() })
}
