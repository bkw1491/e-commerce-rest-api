import { Db } from '@config/database';
import { IUser } from '@interfaces/IUser';
import { hash } from '@utils/crypt';


export const UserModel = {
  
  async findOneByEmail(email: string) {

    const sql = `
    
      SELECT  *
      FROM    users
      WHERE   email = $1`;

    return await Db.one<IUser>(sql, [email]);
  },


  async findOneById(id: number) {

    const sql = `

      SELECT  *
      FROM    users
      WHERE   id = $1`;

    return await Db.one<IUser>(sql, [id]);
  },
  
  
  async createOne(user: IUser) {

    const { email, password } = user
  
    const hashed = hash(password);

    const sql = `
    
      INSERT INTO   users (email, password, admin)
      VALUES        ($1, $2, $3)
      RETURNING     *`;
 
    //admin defaults false, only want to return the id to the user
    return (await Db.one<IUser>(sql, [email, hashed, false])).id;
  }
}


