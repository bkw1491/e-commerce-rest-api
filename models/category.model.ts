import { Db } from '@config/database';
import { ICategory } from "@interfaces/ICategory";
import { IProduct } from '@interfaces/IProduct';


export const CategoryModel = {

  async findOne(id: number) {
  
    const sql = `

      SELECT *
      FROM   category
      WHERE  id = $1`;
  
    return await Db.one<ICategory>(sql, [id]);
  },


  async findMany(categoryId: number) {

    const sql = `
    
      SELECT product.* 
      FROM   product
      JOIN   category
      ON     product.category_id = category.id
      WHERE  category.id = $1`;
    
    return await Db.one<IProduct>(sql, [categoryId]);
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

