import { Db } from '@config/database';
import { ICategory } from "@interfaces/ICategory";


export const CategoryModel = {

  async findAll() {

    const sql = `
    
      SELECT * 
      FROM   category`;
    
    return await Db.many<ICategory>(sql);
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

  
  async createOne(category: Omit<ICategory, "id">) {

    const { name, descr } = category;

    const sql = `

      INSERT INTO category (name, descr)
      VALUES      ($1, $2)
      RETURNING   *`;
  
    return await Db.one<ICategory>(sql, [name, descr]);
  },
  
  
  async updateOne(category: ICategory) {

    const { id, name, descr } = category
  
    const sql = `
    
    UPDATE    category
    SET       name = $1, descr = $2
    WHERE     id = $3
    RETURNING *`;
  
    return await Db.one<ICategory>(sql, [name, descr, id]);
  },
  
  
  async deleteOne(id: number) {
  
    const sql = `

      DELETE FROM category
      WHERE       id =  $1
      RETURNING   *`;
  
    return await Db.one<ICategory>(sql, [id]);
  }
}

