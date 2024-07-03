import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ msg: 'Missing username or password' })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    email: {
      isEmail: {
        bail: true
      },
      notEmpty: {
        bail: true
      },
      trim: true
    },
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 3, max: 100 }
      },
      trim: true
    },
    password: {
      notEmpty: true,
      isLength: {
        options: { min: 3, max: 20 }
      }
    },
    confirmPassword: {
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match')
          }
          return true
        }
      }
    }
  })
)
