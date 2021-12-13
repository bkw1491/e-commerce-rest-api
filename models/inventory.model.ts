import query from '@config/database';
import { IInventory } from 'schema/inventory.schema';

export const InventoryModel = {
  
  /**
   * Looks for an existing inventory in the database 
   * with the provided id
   */
  async findOne(id: number) : Promise<IInventory>{
  
    const sql = `SELECT *
                 FROM inventory
                 WHERE id = $1`;
    //use prepared statement
    const result = await query<IInventory>(sql, [id]);
    //always only one result
    return result[0];
  },
  
  
  /**
   * Add a new inventory.Returns the new row
   */
  async createOne(inventory: IInventory) : Promise<IInventory> {
  
    const sql = `INSERT INTO inventory (quantity)
                 VALUES $1
                 RETURNING *`
  
    //use prepared statement
    const result = await query<IInventory>(sql, [inventory.quantity])
    //return the created row
    return result[0];
  },
  
  
  /**
   * Updates a row in the inventory table. Returns the updated row
   */
  async updateOne(inventory: IInventory) : Promise<IInventory> {
  
    const sql = `UPDATE inventory
                 SET quantity = $1 
                 WHERE id = $2
                 RETURNING *`;
    //use prepared statement
    const result = await query<IInventory>(sql, [inventory.quantity, inventory.id]);
    //return the updated row
    return result[0];
  },
  
  
  /**
   * Removes a row in the inventory table. Cascades to product table
   */
  async deleteOne(id: number) : Promise<IInventory> {
  
    const sql = `DELETE FROM inventory
                 WHERE id = $1
                 RETURNING *`;
    
    const result = await query<IInventory>(sql, [id]);
    //return the deleted row
    return result[0];
  }
}
