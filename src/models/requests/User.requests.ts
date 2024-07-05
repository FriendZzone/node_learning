import { UserType } from '../schemas/User.schema'

export interface RegisterReqBody extends Pick<UserType, 'email' | 'password' | 'name'> {
  date_of_birth: string
}
