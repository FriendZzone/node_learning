import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { matchedData, validationResult } from 'express-validator'
import { ObjectId } from 'mongodb'
import { UserMessages } from '~/constants/messages'
import { LogoutReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import userServices from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await userServices.login(user_id.toString())
  res.json({ msg: UserMessages.LOGIN_SUCCESS, result })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const isValid = validationResult(req)
  if (isValid.isEmpty()) {
    const data = matchedData(req)
    const { email, password, name, date_of_birth } = data
    const result = await userServices.register({ email, password, name, date_of_birth })

    return res.json({ msg: UserMessages.REGISTER_SUCCESS, data: result })
  }

  return res.status(400).json({ errors: isValid.array() })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userServices.logout(refresh_token)
  return res.json(result)
}
