import jwt from 'jsonwebtoken'
import { env } from '$env/dynamic/private'

const SECRET = env.JWT_SECRET!

export function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}
