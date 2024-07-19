import { TokenPayload } from './models/requests/User.requests'
import { UserType } from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: UserType
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
