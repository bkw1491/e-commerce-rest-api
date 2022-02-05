import { Db } from "@config/database";
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
		const { product_id, quantity } = inventory;

		const sql = `

      INSERT INTO inventory (product_id, quantity)
      VALUES      ($1, $2)
      RETURNING   *`;

		return await Db.one<IInventory>(sql, [product_id, quantity]);
	},

	async updateOne(inventory: Omit<IInventory, "id">) {
		const { product_id, quantity } = inventory;

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

      UPDATE inventory AS i
      SET quantity = i.quantity - c.quantity
      FROM (
        SELECT quantity, product_id
        FROM cart
        WHERE user_id = $1
      ) AS c
      WHERE i.product_id = c.product_id`;

		return await Db.many<IInventory>(sql, [user_id]);
	}
};
