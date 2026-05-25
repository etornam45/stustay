import { randomBytes } from 'crypto'

export function randomId(length: number = 24): string {
  return randomBytes(length).toString('hex')
}
