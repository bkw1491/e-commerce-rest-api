import { Db } from '@config/database';
import { IProduct } from '@interfaces/IProduct';


export const ProductModel = {

  
  async findAll() {
  
    const sql = `

      SELECT *
      FROM   product`;
  
    return await Db.many<IProduct>(sql);
  },

  
  async findOne(id: number) {
  
    const sql = `

      SELECT *
      FROM   product
      WHERE  id = $1`;
  
    return await Db.one<IProduct>(sql, [id]);
  },

  
  async createOne(product: Omit<IProduct, "id">) {

    const { 
      inventory, 
      categoryId, 
      name, 
      descr, 
      price, 
      imageUrl 
    } = product
  
    const sql = `

      INSERT INTO product (inventory, 
                          category_id, 
                          name, 
                          descr, 
                          price, 
                          image_url)
      VALUES      ($1, $2, $3, $4, $5, $6)
      RETURNING   *`
                
    return await Db.one<IProduct>(sql, [inventory, 
      categoryId, name, descr, price, imageUrl]);
  },

  
  async updateOne(product: IProduct) {

    const {
      id,
      inventory, 
      categoryId, 
      name, 
      descr, 
      price, 
      imageUrl 
    } = product
  
    const sql = `
    
      UPDATE    product
      SET       category_id = $1,
                inventory = $2,
                name = $3, 
                descr = $4, 
                price = $5, 
                image_url = $6
      WHERE     id = $7
      RETURNING *`;
   
    return await Db.one<IProduct>(sql, [categoryId, 
      inventory, name, descr, price, imageUrl, id]);
  },

  
  async deleteOne(id: number) {
    
    const sql = `

      DELETE FROM product
      WHERE       id = $1
      RETURNING   *`;
  
    return await Db.one<IProduct>(sql, [id]);
  }
}

