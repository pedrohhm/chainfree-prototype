import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const deriveKey = promisify(scrypt);
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const storedHashFormat = /^scrypt-v1\$([a-f0-9]{32})\$([a-f0-9]{128})$/;
const dummySalt = randomBytes(16);

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, 64, options);
  return `scrypt-v1$${salt.toString('hex')}$${key.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  const match = storedHashFormat.exec(storedHash ?? '');
  const salt = match ? Buffer.from(match[1], 'hex') : dummySalt;
  const expected = match ? Buffer.from(match[2], 'hex') : Buffer.alloc(64);
  const key = await deriveKey(password, salt, expected.length, options);
  return timingSafeEqual(key, expected) && match !== null;
}
