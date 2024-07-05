import { TokenType } from '~/constants/enums'
import { RegisterReqBody } from '~/models/requests/User.requests'
import User, { UserType } from '~/models/schemas/User.schema'
import { sha256 } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import databaseService from './database.services'

class UserServices {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    })
  }

  async register(payload: RegisterReqBody) {
    const { password, date_of_birth } = payload
    const result = await databaseService.users.insertOne(
      new User({ ...payload, password: sha256(password), date_of_birth: new Date(date_of_birth) })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    return { access_token, refresh_token }
  }

  findOne(email: UserType['email']) {
    return databaseService.users.findOne({ email })
  }
}
const userServices = new UserServices()
export default userServices
