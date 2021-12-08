import query from '@config/database';

import { IUser } from '@models/user.model';
import { hash } from '@utils/crypt';

/**
 * Looks for an existing user in the database 
 * with the provided email
 */
export async function findOne(email: string) : Promise<IUser | null> {

  //email is unique
  const sql = `SELECT *
               FROM users
               WHERE email = ?
               LIMIT 1`;
  //prepared statement prevents injection
  const result = await query<IUser>(sql, [email]);
  //return first element in result array, always 1 result
  return result[0];
}


/**
 * Adds a new user to the database.
 * Return true on success, false if failure
 */
export async function createOne(user: IUser) : Promise<void> {

  //call crypt util to hash the password
  const pass = hash(user.pass);
  //prepared statement prevents injection
  const sql = `INSERT INTO users (email, pass)
               VALUES (?, ?)`
  //query not typed here- no results are returned
  await query(sql, [user.email, pass]);
}



//logout a user

