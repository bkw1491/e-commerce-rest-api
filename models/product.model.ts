import query from '@config/database';
import { IProduct } from '@interfaces/IProduct';


export const ProductModel = {

  
  async findAll() : Promise<IProduct[]> {
  
    const sql = `SELECT *
                 FROM product`;
  
    return await query<IProduct>(sql);
  },

  
  async findOne(id: number) : Promise<IProduct> {
  
    const sql = `SELECT *
                 FROM product
                 WHERE id = $1`;
  
    const result = await query<IProduct>(sql, [id]);
    //query returns only one row
    return result[0];
  },

  
  async createOne(product: Omit<IProduct, "id">) : Promise<IProduct> {
  
    //inventory default to one if not supplied
    const sql = `INSERT INTO product
                (inventory, category_id, name, descr, price, image_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`
                
    const result = await query<IProduct>(sql, 
      [product.inventory, product.category_id, product.name, 
      product.descr, product.price, product.image_url]);
    //return the inserted row
    return result[0];
  },

  
  async updateOne(product: IProduct) : Promise<IProduct>{
  
    const sql = `UPDATE product
                 SET inventory = $1 name = $2, descr = $3, price = $4, image_url = $5 
                 WHERE id = $5
                 RETURNING *`;
   
    const result = await query<IProduct>(sql, 
      [product.name, product.descr, product.price,
      product.inventory, product.image_url, product.id]);
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

