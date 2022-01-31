import { Db } from '@config/database';
import { IInventory } from "@interfaces/IInventory";


export const InventoryModel = {

  async findOne(product_id: number) {

    const sql = `
    
      SELECT * 
      FROM   inventory
      WHERE  product_id = $1`;
    
    return await Db.one<IInventory>(sql, [product_id]);
  },

  
  async createOne(inventory: Omit<IInventory, "id">) {

    const { product_id, quantity } = inventory

    const sql = `

      INSERT INTO inventory (product_id, quantity)
      VALUES      ($1, $2)
      RETURNING   *`;
  
    return await Db.one<IInventory>(sql, [product_id, quantity]);
  },
   

  async updateOne(inventory: Omit<IInventory, "id">) {

    const { product_id, quantity } = inventory
  
    const sql = `
    
      UPDATE    inventory
      SET       quantity = $2 
      WHERE     product_id = $1
      RETURNING *`;
  
    return await Db.one<IInventory>(sql, [product_id, quantity]);
  },

  
  async updateMany(user_id: number) {
    //used to update the inventory once payment completes
    const sql = `

      WITH purchased as (

        SELECT product_id, quantity
        FROM cart_item
        WHERE user_id = $1
      )
      
      UPDATE inventory
      SET    quantity = quantity - purchased.quantity
      WHERE  product_id 
      IN
      SELECT product_id
      FROM   purchased`

    return await Db.many<IInventory[]>(sql, [user_id]);
  }
}

