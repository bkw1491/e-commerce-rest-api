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


  async findByCategory(department: string, category: string) {
    //many to many relationship, see ERD
    const sql = `
    
      SELECT p.* 
      FROM   product p
      JOIN   product_category pc
      ON     p.id = pc.product_id
      JOIN   category c
      ON     c.name = pc.category_name
      WHERE  c.name = $1
      AND    p.department = $2`;
    
    return await Db.many<IProduct>(sql, [department, category]);
  },


  async findByDepartment(department: string) {

    const sql = `
    
      SELECT * 
      FROM   product
      WHERE  department = $1`;
    
    return await Db.many<IProduct>(sql, [department]);
  },


  async findByName(name: string) {
    //ILIKE is case-insensitive
    const sql = `

      SELECT *
      FROM   product
      WHERE  name ~~* $1`;

    return await Db.many<IProduct>(sql, [`%${name}%`]); 
  },

  
  async createOne(product: Omit<IProduct, "id">) {

    const { name, descr, price, image_url, 
      image_alt, categories } = product;
  
    //need to insert array of category names into junction table
    //adapted from: https://dba.stackexchange.com/questions/63270/unnest-multiple-arrays-into-rows
    const sqlProduct = `

      WITH p AS (

        INSERT INTO product 
        (name, descr, price, image_url, image_alt)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      )
        
      INSERT INTO product_category
      (product_id, category_name)
      SELECT p.id, cname
      FROM p, unnest($6::text[]) AS cname
      RETURNING (SELECT id FROM p);`;
    
    const { id } = await Db.one<Pick<IProduct, "id">>(sqlProduct, [name, 
      descr, price, image_url, image_alt, categories]);
    //?? is there a way to return this from the query above??
    return { id, ...product };
  },

  
  async updateOne(product: IProduct) {

    const { id, name, descr, price,
      image_url, image_alt, categories } = product
  
    //need to insert array of category names into junction table
    //first remove any entries for product
    //then insert the updated categories from the array 
    //adapted from: https://dba.stackexchange.com/questions/63270/unnest-multiple-arrays-into-rows
    const sql = `

      WITH removed AS (
        DELETE FROM product_category
        WHERE product_id = $1
      ),
      inserted AS (               
        INSERT INTO product_category
        (product_id, category_name)
        SELECT $1, cnames
        FROM unnest($7::text[]) AS cnames
      )

      UPDATE product
      SET name = $2, descr = $3, price = $4, 
      image_url = $5, image_alt = $6
      WHERE id = $1
      RETURNING *`;  
   
    const updated = await Db.one<IProduct>(sql, [id, name, 
      descr, price, image_url, image_alt, categories]);
    //?? is there a way to return this from the query above??
    return { ...updated, categories }
  },

  
  async deleteOne(id: number) {
    
    const sql = `

      DELETE FROM product
      WHERE       id = $1
      RETURNING   *`;
  
    return await Db.one<IProduct>(sql, [id]);
  }
}

