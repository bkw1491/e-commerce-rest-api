import { Db } from '@config/database';
import { IOrder } from '@interfaces/IOrder';
import { ICartItem } from '@interfaces/ICartItem';
import { IOrderItem } from '@interfaces/IOrderItem';
import { CartModel } from './cart.model';


export const OrderModel = {

  async findOne(id: number) {

    const sql = `
    
    SELECT  *
    FROM    order o
    JOIN    order_item oi
    ON      oi.order_id = o.id
    JOIN    product p
    ON      o.product_id = p.id
    WHERE   o.id = $1`;

    return await Db.one<IOrderItem>(sql, [id]);
  },


  async findMany(userId: number) {

    const sql = `

      SELECT    *
      FROM      order o
      JOIN      order_item oi
      ON        oi.order_id = o.id
      JOIN      product p
      ON        o.product_id = p.id
      WHERE     oi.user_id = $1
      GROUP BY  oi.order_id`;

    return await Db.many<IOrderItem>(sql, [userId]);
  },


  async createOne(order: IOrder) {

    const { id, user_id, total_cost, placed_date } = order;
    //get the user's cart items
    //TODO already done in cart.model, can this be passed in from stripe webhook?
    const cartItems = await CartModel.findMany(order.user_id);
    //stores array of promises to execute concurrently
    const queries = [];
    //first update status of order to complete
    const sql = `

      UPDATE "order"
      SET     status = "COMPLETED"
      WHERE   user_ id = $1`;
 
    //add promise array
    queries.push(Db.many(sql, [user_id, total_cost, placed_date]));

    cartItems.map(item => {
      //update product inventory and add new order item
      const sql = `

        WITH updated AS (
          UPDATE product
          SET inventory = inventory - $3
          WHERE id = $2
        )
        
        INSERT INTO order_item (order_id, product_id, quantity)
        VALUES      ($1, $2, $3)`;

      //add promise to array
      return queries.push(Db.one<IOrderItem>(sql, [id, item.product_id, item.quantity]));
    });
    //await all to perform concurrently
    await Promise.all(queries);
    //must wait for promises to resolve before returning order info
    return await this.findMany(user_id);
  }
}
