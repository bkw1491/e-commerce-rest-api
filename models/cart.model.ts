import log from '@utils/logger';

import { Db } from "@config/database";
import { ICartItem } from "@interfaces/ICartItem";
import { IOrder } from '@interfaces/IOrder';
import { stripeSession } from '@utils/stripe';


export const CartModel = {

  async findOne(id: number) {

    const sql = `
      SELECT *
      FROM   cart
      WHERE  id = $1
    `

    return await Db.one<ICartItem>(sql, [id]);
  },
  

  async findMany(user_id: number) {

    const sql = `

      SELECT c.id, p.name, p.descr, p.price, c.quantity
      FROM   cart c 
      JOIN   product p
      ON     c.product_id = p.id
      WHERE  c.user_id = $1;`
    
    return await Db.many<ICartItem>(sql, [user_id]);
  },


  async addItem(item: Omit<ICartItem, "id">) {
 
    const {user_id, product_id, quantity} = item

    const sql = `

      INSERT INTO cart (user_id, product_id, quantity)
      VALUES      ($1, $2, $3)`;

    //add the new item ot cart
    await Db.one<ICartItem>(sql, [user_id, product_id, quantity]);
    //return the user's cart
    return await this.findMany(item.user_id)
  },


  async updateItem(item: ICartItem) {

    const {quantity, id } = item;

    const sql = `
          
      UPDATE cart
      SET    quantity = $1
      WHERE  cart.id = $2`

    //update item in the cart
    const result = await Db.one<ICartItem>(sql, [quantity, id]);
    //return the user's cart
    return this.findMany(result.user_id)
  },


  async deleteItem(id: number) {

    const sql = `

      DELETE FROM cart
      WHERE       cart.id = $1
      RETURNING   user_id`

    const result = await Db.one<ICartItem>(sql, [id]);
    //return the user's cart
    return this.findMany(result.user_id);
  },


  async checkout(user_id: number) {
    //get items in user's cart
    const cart = await this.findMany(user_id);
    //get a total cost for all items in user's cart
    const total_cost = cart.reduce((total, prev) => total + prev.price, 0);
    //return the inserted row- need to attach id to order items later
    const sql = `
      INSERT INTO orders (user_id, total_cost, placed_date, status)
      VALUES      ($1, $2, $3, $4)
      RETURNING   *`;
    //intial order status is pending
    await Db.one<IOrder>(sql, [user_id, total_cost, new Date(), "PENDING"]);
    //log that a user has initiated a payment
    log(`User ${user_id} Checked Out For Sum £${total_cost}`);
    //return the url to the stripe payment page
    return (await stripeSession(cart)).url!;
  }
}