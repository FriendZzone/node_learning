import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.get('/users', loginValidator, (req, res) => {
  res.json({ msg: 'hello users' })
})

usersRouter.post('/login', loginController)
usersRouter.post('/register', registerController)

export default usersRouter
