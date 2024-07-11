import { config } from 'dotenv'
import { readFileSync } from 'fs'
import jwt, { SignOptions } from 'jsonwebtoken'
config()

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export function verifyAndDecodeJWT(token: string) {
  try {
    // Read the public key from the file
    const publicKey = readFileSync('public.key', 'utf8')

    // Verify the JWT and decode the payload
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })

    return decoded
  } catch (err) {
    console.error('Error verifying and decoding JWT:', err)
    return null
  }
}
