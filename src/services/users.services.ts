import User, { UserType } from '~/models/schemas/User.schema'
import databaseService from './database.services'

class UserServices {
  register(payload: Pick<UserType, 'email' | 'password'>) {
    const { email, password } = payload
    return databaseService.users.insertOne(new User({ email, password }))
  }
}
const userServices = new UserServices()
export default userServices
