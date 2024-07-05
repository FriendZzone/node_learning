import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.get('/users', loginValidator, (req, res) => {
  res.json({ msg: 'hello users' })
})

usersRouter.post('/login', loginController)
usersRouter.post('/register', registerValidator, registerController)

export default usersRouter
