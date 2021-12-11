import query from '@config/database';

import { IUser } from '@models/user.model';
import { hash } from '@utils/crypt';

/**
 * Looks for an existing user in the database 
 * with the provided email. Returns null
 * if one isn't found
 */
export async function findOne(email: string) : Promise<IUser | null> {

  //email is unique
  const sql = `SELECT *
               FROM users
               WHERE email = $1
               LIMIT 1`;
  //use prepared statement
  const result = await query<IUser>(sql, [email]);
  //always only 1 result
  return result[0];
}


/**
 * Adds a new user to the database
 * with the provided email and hashed password.
 * Returns the user_id
 */
export async function createOne(user: IUser) : Promise<number> {

  //call crypt util to hash the password
  const pass = hash(user.pass);
  //db auto generates the user_id
  const sql = `INSERT INTO users (email, pass)
               VALUES ($1, $2)
               RETURNING *`;
  //use prepared statement
  const result = await query<IUser>(sql, [user.email, pass]);
  //return the id back to the user
  return result[0].id;
}

