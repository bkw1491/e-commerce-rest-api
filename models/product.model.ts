import query from '@config/database';
import { IProduct } from 'schema/product.schema';


export const ProductModel = {

  async findAll() : Promise<IProduct[]> {
  
    const sql = `SELECT *
                 FROM product`;
  
    const result = await query<IProduct>(sql);
    //returns multiple rows
    return result;
  },

  
  async findOne(id: number) : Promise<IProduct> {
  
    const sql = `SELECT *
                 FROM product
                 WHERE id = $1`;
  
    const result = await query<IProduct>(sql, [id]);
    //query returns only one row
    return result[0];
  },

  
  async createOne(product: Omit<IProduct, "id" | "inventory_id">) 
    : Promise<IProduct> {
  
    //first create a new inventory
    const sql = `WITH inven AS 
                (
                    INSERT INTO inventory 
                    (quantity)
                    VALUES (1)
                    RETURNING inventory.*
                )             
                INSERT INTO product
                (inventory_id, category_id, name, descr, price, image_url)
                SELECT inven.id, $1, $2, $3, $4, $5
                FROM inven
                RETURNING *`
                
    const result = await query<IProduct>(sql, [product.category_id, product.name, product.descr, product.price, product.image_url]);
    //return the inserted row
    return result[0];
  },

  
  async updateOne(product: Omit<IProduct, "inventory_id">) 
    : Promise<IProduct>{
  
    const sql = `UPDATE product
                 SET name = $1, descr = $2, price = $3, image_url = $4 
                 WHERE id = $5
                 RETURNING *`;
   
    const result = await query<IProduct>(sql, [product.name, 
      product.descr, product.price, product.image_url, product.id]);
    //return the updated row
    return result[0];
  },

  
  async deleteOne(id: number) : Promise<IProduct> {
    
    const sql = `DELETE FROM product
                 WHERE id = $1
                 RETURNING *`;
  
    const result = await query<IProduct>(sql, [id]);
    //return the deleted row
    return result[0];
  }
}

