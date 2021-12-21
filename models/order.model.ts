import query from '@config/database';
import { IOrder } from '@interfaces/IOrder';

export const OrderModel = {

  /**
   * Finds an order by id. 
   * Returns null if one is not found
   */
  async findOne(id: number) {

    const sql = `SELECT  * 
                 FROM    order
                 WHERE   id = $1`;

    const result = await query<IOrder>(sql, [id]);

    return result [0];
  },

  /**
   * Finds all orders associated with the supplied user id
   * Returns an empty array if none are found
   */
  async findMany(user_id: number) {

    const sql = `SELECT  * 
                 FROM    order
                 WHERE   user_d = $1`;

    return await query<IOrder>(sql, [user_id]);
  },


  /**
   * Updates the product inventory to reflect the new order,
   * then adds the new order to the database.
   * Returns the new order.
   */
  async createOne(order: Omit<IOrder, "id">) {

    const sql = `INSERT INTO  order (user_id, total_cost)
                 VALUES       ($1, $2)
                 RETURNING    *`;

    const result = await query<IOrder>(sql, [order.user_id, order.total_cost]);

    return result[0];
  },


  /**
   * Updates an order with the supplied id and parameters.
   * Returns the updated order
   */
  async updateOne(order: IOrder) {

    const sql = `UPDATE     order (user_id, total_cost)
                 SET        user_id = $1, total_cost = $2
                 WHERE      id = $3
                 RETURNING  *`;

    const result = await query<IOrder>(sql, [order.user_id, order.total_cost, order.id]);

    return result[0];
  },


  /**
   * Removed an order with the supplied id.
   * Returns the removed order
   */
  async deleteOne(id: number) {

    const sql = `DELETE FROM  order
                 WHERE        id = $1
                 RETURNING    *`;

    const result = await query<IOrder>(sql, [id]);

    return result[0];
  }
}
