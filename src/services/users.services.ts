import { TokenType } from '~/constants/enums'
import { RegisterReqBody } from '~/models/requests/User.requests'
import User, { UserType } from '~/models/schemas/User.schema'
import { sha256 } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import databaseService from './database.services'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { UserMessages } from '~/constants/messages'
config()

class UserServices {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payload: RegisterReqBody) {
    const { password, date_of_birth } = payload
    const result = await databaseService.users.insertOne(
      new User({ ...payload, password: sha256(password), date_of_birth: new Date(date_of_birth) })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)

    // save refresh token to db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return { access_token, refresh_token }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)

    // save refresh token to db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return { access_token, refresh_token }
  }

  findOne(user: Partial<User>) {
    return databaseService.users.findOne(user)
  }

  async logout(refresh_token: string) {
    const result = await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: UserMessages.LOGOUT_SUCCESS
    }
  }
}
const userServices = new UserServices()
export default userServices
