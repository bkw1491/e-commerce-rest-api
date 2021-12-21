import query from '@config/database';

import { IUser } from '@interfaces/IUser';
import { hash } from '@utils/crypt';


export const UserModel = {
  
  /**
   * Finds a user by email. Returns null if 
   * the user is not found 
   */
  async findOneByEmail(email: string) {
    //email is unique
    const sql = `SELECT  *
                 FROM    users
                 WHERE   email = $1
                 LIMIT   1`;
    //use prepared statement
    const result = await query<IUser>(sql, [email]);
    //always only 1 result
    return result[0];
  },


  /**
   * Finds a user by id. Returns null if
   * the user is not found
   */
  async findOneById(id: number) {

    const sql = `SELECT  *
                 FROM    users
                 WHERE   id = $1`;

    const result = await query<IUser>(sql, [id]);

    return result[0];
  },
  
  
  /**
   * Hashes the password then adds the new user 
   * to the database. Returns the user_id
   */
  async createOne(user: IUser) {
  
    const hashed = hash(user.password);

    const sql = `INSERT INTO   users (email, password)
                 VALUES        ($1, $2)
                 RETURNING     *`;
 
    const result = await query<IUser>(sql, [user.email, hashed]);

    return result[0].id;
  }
}


