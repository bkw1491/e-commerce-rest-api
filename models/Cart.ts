import log from '@utils/logger';

import { Db } from "@config/database";
import { ICartItem } from "@interfaces/ICartItem";
import { OrderModel } from '@models/Order';
import { stripeSession } from '@utils/stripe';


export const CartModel = {

  async findOne(id: number) {

    const sql = `
      SELECT *
      FROM   cart
      WHERE  id = $1`

    return await Db.one<ICartItem>(sql, [id]);
  },
  
  
  async findMany(user_id: number) {

    const sql = `

      SELECT c.id, c.user_id, c.quantity, c.product_id,
             p.name, p.descr, p.price, p.image_url, p.image_alt    
      FROM   cart c 
      JOIN   product p
      ON     c.product_id = p.id
      WHERE  c.user_id = $1;`
    
    return await Db.many<ICartItem>(sql, [user_id]);
  },


  async createOne(item: Omit<ICartItem, "id">) {
 
    const {user_id, product_id, quantity} = item

    const sql = `

      INSERT INTO cart (user_id, product_id, quantity)
      VALUES      ($1, $2, $3)`;

    //add the new item ot cart
    await Db.one<ICartItem>(sql, [user_id, product_id, quantity]);
    //return the user's cart
    return await this.findMany(item.user_id)
  },


  async updateOne(item: ICartItem) {

    const { quantity, id } = item;

    const sql = `
          
      UPDATE cart
      SET    quantity = $1
      WHERE  cart.id = $2`

    //update item in the cart
    await Db.one<ICartItem>(sql, [quantity, id]);
    //return the user's cart
    return this.findMany(item.user_id);
  },


  async deleteOne(id: number) {

    const sql = `

      DELETE FROM cart
      WHERE       cart.id = $1
      RETURNING   user_id`

    const result = await Db.one<ICartItem>(sql, [id]);
    //return the user's cart
    return this.findMany(result.user_id);
  },


  async deleteMany(user_id: number) {

    const sql = `

      DELETE FROM cart
      WHERE       cart.user_id = $1
      RETURNING   *`

    return await Db.many<ICartItem>(sql, [user_id]);
  },


  async checkout(cart: ICartItem[]) {
    //calculate a total cost
    const total_cost = cart.reduce((total, item) => {
      return total + item.price;
    }, 0)
    //intialize a new payment session
    const session = await stripeSession(cart);
    //a user has checked out and has started a payment
    log(`User ${cart[0].user_id} Intialized A Payment Intent`);
    //add order to the database, intially status is pending
    await OrderModel.createOne({id: session.payment_intent as string, 
      user_id: cart[0].user_id, total_cost, placed_date: new Date(), status: "PENDING"});
    //temp for testing
    console.log(session.url!);
    //return the url to the stripe payment page
    return session.url!;
  }
}