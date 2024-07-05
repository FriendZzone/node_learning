import { createHash } from 'crypto'

export function sha256(str: string) {
  return createHash('sha256').update(`${process.env.PASSWORD_SECRET}${str}`).digest('hex')
}
