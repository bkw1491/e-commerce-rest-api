import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/**
 * Hashes a plain text password with a salt.
 * Returns a string in the form [salt]:[hash]
 */
export function hash(password: string) {
  //generate a salt
  const salt = randomBytes(16).toString('hex');
  //hash the password passing in the salt
  const hash = scryptSync(password, salt, 64).toString('hex');
  //return the has prepended by the salt
  return `${salt}:${hash}`;

}


/**
 * Compares a candiate password to a hashed password
 */
export function compare(candidate: string, hash: string) {
  //get salt and the key from the hash
  const [salt, key] = hash.split(':');
  //recreate the hash using the candiate password
  const hashedBuffer = scryptSync(candidate, salt, 64);
  //convert the key to hex
  const keyBuffer = Buffer.from(key, 'hex');
  //constant-time algorithm, compares without leaking timing
  //info that could allow attacker to guess one of the values
  return timingSafeEqual(hashedBuffer, keyBuffer);
}