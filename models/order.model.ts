import { Database } from '@config/database';
import { IOrderItem } from '@interfaces/IOrderItem';

export const OrderModel = {

  /**
   * Finds an order by id. 
   * Returns null if one is not found
   */
  async findOne(id: number) {

    const sql = `
    
    SELECT  * 
    FROM    order o
    JOIN    product p
    ON      o.product_id = p.id
    WHERE   o.id = $1`;

    const result = await Database.one<IOrderItem>(sql, [id]);

    return result [0];
  },


  /**
   * Finds all orders associated with the supplied user id
   * Returns an empty array if none are found
   */
  async findMany(user_id: number) {

    const sql = `
    
    SELECT  * 
    FROM    order o
    JOIN    product p
    ON      o.product_id = p.id
    WHERE   o.user_id = $1`;

    return await Database.one<IOrderItem>(sql, [user_id]);
  },


  /**
   * Updates the product inventory to reflect the new order,
   * adds the new order to the database then removes the items
   * from the user's cart
   * Returns the new order.
   */
  async createOrder(order: Omit<IOrderItem, "id">) {

    //remove items from user's cart
    //update product inventory
    //add order to the table
    const sql = `
    
    `

    const result = await Database.one<IOrderItem>(sql, [order.user_id, order.product_id, 
      order.quantity]);

    return result[0];
  },
}
