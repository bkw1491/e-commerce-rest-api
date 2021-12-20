import query from '@config/database';
import { ICategory } from "@interfaces/ICategory";
import { IProduct } from '@interfaces/IProduct';

export const CategoryModel = {

  /**
   * Finds a row in the category table, returns null if not found
   */
  async findOne(id: number) : Promise<ICategory> {
  
    const sql = `SELECT *
                 FROM category
                 WHERE id = $1`;
  
    const result = await query<ICategory>(sql, [id]);
  
    return result[0];
  },

  /**
   * Finds products by category_id
   */
  async findProducts(category_id: number) : Promise<IProduct[]> {

    const sql = `SELECT product.* 
                FROM product
                INNER JOIN category
                ON product.category_id = category.id
                WHERE category.id = $1`;
    
    const result = await query<IProduct>(sql, [category_id]);
    //query returns multiple rows
    return result;
  },
  
  
  /**
   * Creates a new row in the category table. Returns the new row
   */
  async createOne(name: string) : Promise<ICategory> {
  
    //db auto assigns category_id
    const sql = `INSERT INTO category (name)
                 VALUES ($1)
                 RETURNING *`;
  
    const result = await query<ICategory>(sql, [name]);
    //return the new row
    return result[0];
  },
  
  
  /**
   * Updates ta row in the category table. Returns the updated row
   */
  async updateOne(category: ICategory) : Promise<ICategory> {
  
    const sql = `UPDATE category
                 SET name = $1
                 WHERE id = $2
                 RETURNING *`;
  
    const result = await query<ICategory>(sql, [category.name, category.id]);
    //return the updated row
    return result[0];
  },
  
  
  /**
   * Deletes a category record
   * with provided id. Cascades to all products assigned to this category
   */
  async deleteOne(id: number) : Promise<ICategory> {
  
    const sql = `DELETE FROM category
                 WHERE id = $1
                 RETURNING *`;
  
    const result = await query<ICategory>(sql, [id]);
    //return the deleted row
    return result[0];
  }
}

