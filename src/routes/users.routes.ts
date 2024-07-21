import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.get('/users', accessTokenValidator, (req, res) => {
  res.json({ msg: 'hello users' })
})

/**
 * Handle login request.
 * @route POST /login
 * @param {Object} req.body - The request body containing user credentials.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Object} A JSON object containing a success message and the user data.
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Register a new user.
 * @route POST /register
 * @param {Object} req.body - The request body containing user data.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.date_of_birth - The date of birth of the user.
 * @returns {Object} A JSON object containing a success message and the created user data.
 * @throws {Error} If the request body is invalid.
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Logout a user.
 * @route POST /logout
 * @param {string} req.headers.authorization - The access token of the user.
 * @returns {Object} A JSON object containing a success message.
 * @throws {Error} If the access token is invalid.
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Verify Email.
 * @route POST /verify-email
 * @returns {Object} A JSON object containing a success message.
 * @throws {Error} If the access token is invalid.
 */
// usersRouter.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController))

export default usersRouter
