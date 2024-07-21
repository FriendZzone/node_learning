import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HttpStatus from '~/constants/httpStatus'
import { UserMessages } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { sha256 } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: UserMessages.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value, password: sha256(req.body.password) })
          if (!user) {
            throw new Error(UserMessages.USER_NOT_FOUND)
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: UserMessages.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: UserMessages.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: UserMessages.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      }
    }
  })
)

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: UserMessages.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: UserMessages.NAME_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: UserMessages.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: UserMessages.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: UserMessages.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await usersService.findOne({ email: value })
          if (isExistEmail) {
            throw new Error(UserMessages.EMAIL_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: UserMessages.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: UserMessages.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: UserMessages.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: UserMessages.CONFIRM_PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: UserMessages.CONFIRM_PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 6,
          max: 50
        },
        errorMessage: UserMessages.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(UserMessages.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: UserMessages.DATE_OF_BIRTH_MUST_BE_ISO8601
      }
    }
  })
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: UserMessages.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value && value.split(' ')[1]

            if (!access_token) {
              throw new ErrorWithStatus({
                status: HttpStatus.UNAUTHORIZED,
                message: UserMessages.ACCESS_TOKEN_IS_REQUIRED
              })
            }

            const decoded_authorization = await verifyToken({
              token: access_token,
              secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
            })
            req.decoded_authorization = decoded_authorization

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                status: HttpStatus.UNAUTHORIZED,
                message: UserMessages.REFRESH_TOKEN_IS_REQUIRED
              })
            }
            try {
              const decoded_refresh_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
              })
              if (decoded_refresh_token === null) {
                throw new ErrorWithStatus({
                  status: HttpStatus.UNAUTHORIZED,
                  message: UserMessages.USED_REFRESH_TOKEN_OR_NOT_EXIST
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  status: HttpStatus.UNAUTHORIZED,
                  message: UserMessages.REFRESH_TOKEN_IS_INVALID
                })
              }
              throw error
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
