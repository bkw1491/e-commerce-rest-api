import query from '@config/database';

import { IUser } from '@interfaces/IUser';
import { hash } from '@utils/crypt';

export const UserModel = {
  
  /**
   * Finds a user. Returns null if not found 
   */
  async findOne(email: string) : Promise<IUser> {
  
    //email is unique
    const sql = `SELECT *
                 FROM users
                 WHERE email = $1
                 LIMIT 1`;
    //use prepared statement
    const result = await query<IUser>(sql, [email]);
    //always only 1 result
    return result[0];
  },
  
  
  /**
   * Adds a new user. Returns the user_id
   */
  async createOne(user: IUser) : Promise<number> {
  
    //call crypt util to hash the password
    const hashed = hash(user.password);
    //db auto generates the user_id
    const sql = `INSERT INTO users (email, password)
                 VALUES ($1, $2)
                 RETURNING *`;
    //use prepared statement
    const result = await query<IUser>(sql, [user.email, hashed]);
    //return the id back to the user
    return result[0].id;
  }
}


