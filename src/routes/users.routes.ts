import { Router } from 'express'
import { loginController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.get('/users', loginValidator, (req, res) => {
  res.json({ msg: 'hello users' })
})

usersRouter.post('/login', loginController)

export default usersRouter
