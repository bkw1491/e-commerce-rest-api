import query from '@config/database';
import { IInventory } from '@models/inventory.model';

export async function findOne(id: number) : Promise<IInventory>{

  const sql = `SELECT *
               FROM inventory
               WHERE id = ?`;
  //use prepared statement
  const inventory = await query<IInventory>(sql, [id]);
  //always only one result
  return inventory[0];
}

export async function createOne(inventory: IInventory) : Promise<void> {

  const sql = `INSERT INTO inventory (quantity)
               VALUES  ? `

  //inject args into the statement
  await query<IInventory>(sql, [inventory.quantity])
}

export async function updateOne(inventory: IInventory) : Promise<void> {

  const sql = `UPDATE inventory
               SET quantity = ? 
               WHERE id = ?`;
  
  await query<IInventory>(sql, [inventory.quantity, inventory.id]);
}

export async function deleteOne(id: number) : Promise<void> {

  const sql = `DELETE FROM inventory
               WHERE id = ?`;

  await query<IInventory>(sql, [id]);
}