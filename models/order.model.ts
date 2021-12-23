import { Db } from '@config/database';
import { IOrderItem } from '@interfaces/IOrderItem';

export const OrderModel = {

  async findOne(id: number) {

    const sql = `
    
    SELECT  * 
    FROM    order o
    JOIN    product p
    ON      o.product_id = p.id
    WHERE   o.id = $1`;

    return await Db.one<IOrderItem>(sql, [id]);
  },


  async findMany(userId: number) {

    const sql = `
    
    SELECT  * 
    FROM    order o
    JOIN    product p
    ON      o.product_id = p.id
    WHERE   o.user_id = $1`;

    return await Db.one<IOrderItem>(sql, [userId]);
  },


  async createOrder(order: Omit<IOrderItem, "id">) {


    //remove items from user's cart
    //update product inventory
    //add order to the table
  }

}
