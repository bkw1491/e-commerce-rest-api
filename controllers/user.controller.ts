import query from '@config/database';
import IUser from '@interfaces/IUser';

import { hash, compare } from '@utils/crypt';

/**
 * Looks for an existing user in the database 
 * with the provided email
 */
async function findOne(email: string) : Promise<IUser | null> {

  //email is unique, no need to continue searching
  //after a match is found
  const sql = `SELECT *
               FROM users
               WHERE email = ?
               LIMIT 1`;

  //prepared statement prevents injection attacks
  const result = await query<IUser>(sql, [email]);

  //return first element in result array
  //always only 1 result in this case
  return result[0];
}


/**
 * Adds a new user to the database.
 */
export async function createOne(user: IUser) : Promise<void> {

  //call crypt util to hash the password
  const pass = hash(user.pass);

  const sql = `INSERT INTO users (email, pass)
               VALUES (?, ?)`

  //db generates unique id, converts in base16
  //to reduce storage use
  await query(sql, [user.email, pass]);
}


/**
 * Authenticates an existing user and logs them in
 */
export async function authOne(candiate: IUser) : Promise<void> {

  //check if user with supplied email exists
  const user = await findOne(candiate.email);

  if(user) {

    //call method from crypt to validate password
    compare(candiate.pass, user.pass);
  }
}



//logout a user

