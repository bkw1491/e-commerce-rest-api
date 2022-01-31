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
    //many to many relationship, see ERD
    const sql = `
    
      SELECT product.* 
      FROM   product p
      JOIN   product_category pc
      ON     p.id = pc.product_id
      JOIN   category c
      ON     c.id = pc.category_id
      WHERE  c.name = $1`;
    
    return await Db.many<IProduct[]>(sql, [categoryName]);
  },

  
  async createOne(product: Omit<IProduct, "id">) {

    const { name, descr, price, image_url, 
      image_alt } = product
  
    const sql = `

      INSERT INTO product 
                  (name, 
                  descr, 
                  price, 
                  image_url,
                  image_alt)
      VALUES      ($1, $2, $3, $4, $5)
      RETURNING   *`
                
    return await Db.one<IProduct>(sql, [name, 
      descr, price, image_url, image_alt]);
  },

  
  async updateOne(product: IProduct) {

    const { id, name, descr, price,
      image_url, image_alt } = product
  
    const sql = `
    
      UPDATE    product
      SET       name = $1, 
                descr = $2, 
                price = $3, 
                image_url = $4
                image_alt = $5
      WHERE     id = $6
      RETURNING *`;
   
    return await Db.one<IProduct>(sql, [name, 
      descr, price, image_url, image_alt, id]);
  },

  
  async deleteOne(id: number) {
    
    const sql = `

      DELETE FROM product
      WHERE       id = $1
      RETURNING   *`;
  
    return await Db.one<IProduct>(sql, [id]);
  }
}

