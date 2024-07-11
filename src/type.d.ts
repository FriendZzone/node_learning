import { UserType } from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: UserType
  }
}
