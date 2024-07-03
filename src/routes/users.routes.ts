import { Router } from 'express'
import { body, query } from 'express-validator'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.get('/users', loginValidator, (req, res) => {
  res.json({ msg: 'hello users' })
})

usersRouter.post('/login', loginController)
usersRouter.post('/register', body('email').isEmail().withMessage('Invalid email').escape(), registerController)

export default usersRouter
