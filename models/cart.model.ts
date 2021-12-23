import Stripe from 'stripe';

import { Db } from "@config/database";
import { ICartItem } from "@interfaces/ICartItem";


export const CartModel = {

  async findItems(userId: number) {

    const sql = `

      SELECT c.id, p.name, p.descr, p.price, c.quantity
      FROM   cart c 
      JOIN   product p
      ON     c.product_id = p.id
      WHERE  c.user_id = $1;`
    
    return await Db.many<ICartItem>(sql, [userId]);
  },


  async addItem(item: Omit<ICartItem, "id">) {
 
    const {userId, productId, qty} = item

    const sql = `

      INSERT INTO cart (user_id, product_id, quantity)
      VALUES      ($1, $2, $3)`;

    //add the new item ot cart
    const result = await Db.one<ICartItem>(sql, [userId, productId, qty]);
    //return the user's cart
    return await this.findItems(result.userId)
  },


  async updateItem(item: ICartItem) {

    const {qty, id } = item;

    const sql = `
          
      UPDATE cart
      SET quantity = $1
      WHERE cart.id = $2`

    //update item in the cart
    const result = await Db.one<ICartItem>(sql, [qty, id]);
    //return the user's cart
    return this.findItems(result.userId)
  },


  async deleteItem(cartId: number) {

    const sql = `

      DELETE FROM cart
      WHERE cart.id = $1`

    return await Db.one<ICartItem>(sql, [cartId]);
  },


  async checkout(userId: number) {
    //get the cart items
    const cart = await this.findItems(userId)
    //calculate a total cost
    const total_cost = cart.reduce((total, item) => {
      return total + item.price;
    }, 0);

    const stripe = new Stripe(process.env.STRIPE_SECRET!, {apiVersion: "2020-08-27", typescript: true})

    //create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total_cost,
      currency: 'gbp',
      payment_method_types: ['card']
    })

   //return the payment intent
   return paymentIntent.client_secret
  }
}