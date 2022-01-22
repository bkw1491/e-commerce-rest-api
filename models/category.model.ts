import { Db } from '@config/database';
import { ICategory } from "@interfaces/ICategory";


export const CategoryModel = {

  async findAll() {

    const sql = `
    
      SELECT * 
      FROM   category`;
    
    return await Db.many<ICategory[]>(sql);
  },


  async findOneById(id: number) {
  
    const sql = `

      SELECT *
      FROM   category
      WHERE  id = $1`;
  
    return await Db.one<ICategory>(sql, [id]);
  },

  
  async findOneByName(name: string) {
  
    const sql = `

      SELECT *
      FROM   category
      WHERE  name = $1`;
  
    return await Db.one<ICategory>(sql, [name]);
  },

  
  async createOne(name: string) {

    const sql = `

      INSERT INTO category (name)
      VALUES      ($1)
      RETURNING   *`;
  
    return await Db.one<ICategory>(sql, [name]);
  },
  
  
  async updateOne(category: ICategory) {

    const { id, name } = category
  
    const sql = `
    
    UPDATE    category
    SET       name = $1
    WHERE     id = $2
    RETURNING *`;
  
    return await Db.one<ICategory>(sql, [name, id]);
  },
  
  
  async deleteOne(id: number) {
  
    const sql = `

      DELETE FROM category
      WHERE       id =  $1
      RETURNING   *`;
  
    return await Db.one<ICategory>(sql, [id]);
  }
}

