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
      category_id, 
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
      category_id, name, descr, price, imageUrl]);
  },

  
  async updateOne(product: IProduct) {

    const {
      id,
      inventory, 
      category_id, 
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
   
    return await Db.one<IProduct>(sql, [category_id, 
      inventory, name, descr, price, imageUrl, id]);
  },

  async updateMany(user_id: number) {

    const sql = `
    
      UPDATE product AS p
      SET p.inventory = p.inventory - c.quantity
      FROM (
        SELECT quantity, product_id
        FROM cart
        WHERE user_id = $1
      ) AS c
      WHERE p.id = c.product_id`

    return await Db.many<IProduct>(sql, [user_id]);
  },

  
  async deleteOne(id: number) {
    
    const sql = `

      DELETE FROM product
      WHERE       id = $1
      RETURNING   *`;
  
    return await Db.one<IProduct>(sql, [id]);
  }
}

