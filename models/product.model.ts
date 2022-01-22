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


  async findByCategory(categoryName: string) {

    const sql = `
    
      SELECT product.* 
      FROM   product
      JOIN   category
      ON     product.category_id = category.id
      WHERE  category.name = $1`;
    
    return await Db.one<IProduct[]>(sql, [categoryName]);
  },

  
  async createOne(product: Omit<IProduct, "id">) {

    const { 
      inventory, 
      category_id, 
      name, 
      descr, 
      price, 
      image_url,
      image_alt
    } = product
  
    const sql = `

      INSERT INTO product (inventory, 
                          category_id, 
                          name, 
                          descr, 
                          price, 
                          image_url,
                          image_alt)
      VALUES      ($1, $2, $3, $4, $5, $6)
      RETURNING   *`
                
    return await Db.one<IProduct>(sql, [inventory,category_id, 
      name, descr, price, image_url, image_alt]);
  },

  
  async updateOne(product: IProduct) {

    const {
      id,
      inventory, 
      category_id, 
      name, 
      descr, 
      price, 
      image_url,
      image_alt
    } = product
  
    const sql = `
    
      UPDATE    product
      SET       category_id = $1,
                inventory = $2,
                name = $3, 
                descr = $4, 
                price = $5, 
                image_url = $6
                image_alt = $7
      WHERE     id = $8
      RETURNING *`;
   
    return await Db.one<IProduct>(sql, [category_id, 
      inventory, name, descr, price, image_url, image_alt, id]);
  },

  
  async updateMany(user_id: number) {

    const sql = `
    
      UPDATE product
      SET inventory = inventory - c.quantity
      FROM (
        SELECT quantity, product_id
        FROM cart
        WHERE user_id = $1
      ) AS c
      WHERE id = c.product_id`

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

