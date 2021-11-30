import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * Hashes a plain text password with a salt.
 * Returns a string in the form [salt]:[hash]
 */
export function hash(pswd: string) {

  //generate a salt
  const salt = randomBytes(16).toString('hex');

  //hash the password passing in the salt
  const hash = scryptSync(pswd, salt, 64).toString('hex');

  //return the has prepended by the salt
  return `${salt}:${hash}`;

}

/**
 * Compares a candiate password to a hashed password
 */
export async function compare(candidate: string, hash: string) {

  const [salt, key] = hash.split(':');
  const hashedBuffer = scryptSync(candidate, salt, 64);


  const keyBuffer = Buffer.from(key, 'hex');

  //constant-time algorithm, returns true if a is equal to b
  //without leaking timing info that could allow attacker to guess one of the values
  return timingSafeEqual(hashedBuffer, keyBuffer)
}