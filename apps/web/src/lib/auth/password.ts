import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const SALT_LENGTH = 32
const KEY_LENGTH = 64
const SEPARATOR = ':'

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString('hex')
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex')
  return `${salt}${SEPARATOR}${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(SEPARATOR)
  const derived = scryptSync(password, salt, KEY_LENGTH).toString('hex')
  return timingSafeEqual(Buffer.from(derived), Buffer.from(hash))
}
