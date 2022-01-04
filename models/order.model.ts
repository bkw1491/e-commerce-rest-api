import { Db } from '@config/database';
import { IOrder } from '@interfaces/IOrder';
import { IOrderItem } from '@interfaces/IOrderItem';


export const OrderModel = {

  async findOne(id: string) {

    const sql = `
    
    SELECT  *
    FROM    orders o
    JOIN    order_item oi
    ON      oi.order_id = o.id
    JOIN    product p
    ON      oi.product_id = p.id
    WHERE   o.id = $1`;

    return await Db.one<IOrderItem>(sql, [id]);
  },


  async findMany(user_id: number) {

    const sql = `

      SELECT    *
      FROM      orders o
      JOIN      order_item oi
      ON        oi.order_id = o.id
      JOIN      product p
      ON        oi.product_id = p.id
      WHERE     o.user_id = $1`;

    return await Db.many<IOrderItem>(sql, [user_id]);
  },


  async createOne(order: IOrder) {
    //id is the stripe payment_intent id
    const { id, user_id, total_cost, placed_date, status } = order

    const sql = `

      INSERT INTO orders
      VALUES      ($1, $2, $3, $4, $5)
      RETURNING   *`;

    await Db.one<IOrder>(sql, [id, user_id, 
      total_cost, placed_date, status]);
    //return the order with product info
    return await this.findOne(id);
  },

  
  
  async updateOne(order: Pick<IOrder, "id" | "status">) {
    
    const { id, status } = order;
    
    const sql = `
    
    UPDATE    orders
    SET       status = $2
    WHERE     id = $1
    RETURNING *`;
    
    await Db.one<IOrder>(sql, [id, status]);
    //return the order with product info
    return await this.findOne(id);
  },
  
  async createItems(user_id: number, order_id: string) {

    //get cart items, and order id to insert order item
    //TODO a better way of doing this
    const sql = `
    
    WITH items AS (
      SELECT product_id, quantity, (
        SELECT id
        FROM orders
        WHERE id = $2
      )
      FROM cart
      WHERE user_id = $1
    )
        
    INSERT INTO order_item (product_id, quantity, order_id)
    SELECT * FROM items
    RETURNING *`;
        
    await Db.many<IOrderItem>(sql, [user_id, order_id])
  }
}
