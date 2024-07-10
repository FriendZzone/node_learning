import { HttpStatus } from '~/constants/httpStatus'
import { UserMessages } from '~/constants/messages'

type ErrorsType = Record<string, { msg: string; [key: string]: any }>

export class ErrorWithStatus extends Error {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    super(message)
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = UserMessages.ValidationError, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HttpStatus.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
