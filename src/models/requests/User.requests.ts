import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import { UserType } from '../schemas/User.schema'

export interface RegisterReqBody extends Pick<UserType, 'email' | 'password' | 'name'> {
  date_of_birth: string
}

export interface LoginReqBody extends Pick<UserType, 'email' | 'password'> {
  user?: UserType
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
