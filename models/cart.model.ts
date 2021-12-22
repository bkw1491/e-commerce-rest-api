import Stripe from 'stripe';

import { Database } from "@config/database";
import { ICartItem } from "@interfaces/ICartItem";


export const CartModel = {

   /**
   * Returns the cart items associated
   * with the supplied user id.
   */
  async getItems(item: Pick<ICartItem, "user_id">) {

    //perform an inner join to return all the products in the cart
    const sql = `

      SELECT c.id, p.name, p.descr, p.price, c.quantity
      FROM   cart c 
      JOIN   product p
      ON     c.product_id = p.id
      WHERE  c.user_id = $1;`
    
    return await Database.one<ICartItem>(sql, [item.user_id]);
  },


   /**
   * Add an item to the user's cart.
   * Returns the cart with the new item.
   */
  async addItem(item: Omit<ICartItem, "id">) {
    //insert into the cart table
    const sql = `

      INSERT INTO  cart (user_id, product_id, quantity)
      VALUES       ($1, $2, $3);
    
      SELECT c.id, p.name, p.descr, p.price, c.quantity
      FROM   cart c 
      JOIN   product p
      ON     c.product_id = p.id
      WHERE  c.user_id = $1;`;

    return await Database.multi<ICartItem>(sql, [item.user_id, 
      item.product_id, item.quantity]);
  },


  /**
  * Update an item in the user's cart.
  * Returns the cart with the updated item.
  */
  //!problem here, need user_id from prev query, but need prev
  //!query to finish before returning the cart
  async updateItem(item: ICartItem) {

    const sql = `

      WITH updated as (
            
        UPDATE cart
        SET quantity = qty
        WHERE cart.id = cid
        RETURNING user_id
      )
      
      SELECT c.id, p.name, p.descr, p.price, c.quantity
      FROM   cart c
      JOIN   product p ON c.product_id = p.id
      WHERE  c.user_id = (SELECT user_id FROM removed)
      AND    c.id <> cid;`

    return await Database.one<ICartItem>(sql, [item.id, item.quantity]);
  },


  /**
  * Removes an item in the user's cart.
  * Returns the cart with the item removed.
  */
  async deleteItem(item: Pick<ICartItem, "id">) {

    const sql = `
    
    WITH removed AS (

      DELETE FROM cart
      WHERE cart.id = cid
      RETURNING user_id
    )

    SELECT c.id, p.name, p.descr, p.price, c.quantity
    FROM   cart c
    JOIN   product p ON c.product_id = p.id
    WHERE  c.user_id = (SELECT user_id FROM removed)
    AND    c.id <> cid;`

    return await Database.one<ICartItem>(sql, [item.id]);
  },

  /**
  * Creates a new payment intent using stripe.
  * Returns the client secret for the intent.
  */
  async checkout(user_id: number) {

    //get the cart items
    const cart = await this.getItems({user_id})
    //calculate a total cost
    const total_cost = cart.reduce((total, item) => {
      return total + item.price;
    }, 0);

    const stripe = new Stripe(process.env.STRIPE_SECRET, {apiVersion: "2020-08-27", typescript: true})

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