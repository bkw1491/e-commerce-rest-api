import { Db } from "@config/database";
import { ICartItem } from "@interfaces/ICartItem";
import { OrderModel } from './order.model';
import { IOrderItem } from '@interfaces/IOrderItem';
import { IOrder } from '@interfaces/IOrder';
import { Stripe } from "stripe";


export const CartModel = {

  async findOne(cartId: number) {

    const sql = `
      SELECT *
      FROM   cart
      WHERE  id = $1
    `

    return await Db.one<ICartItem>(sql, [cartId]);
  },
  

  async findMany(userId: number) {

    const sql = `

      SELECT c.id, p.name, p.descr, p.price, c.quantity
      FROM   cart c 
      JOIN   product p
      ON     c.product_id = p.id
      WHERE  c.user_id = $1;`
    
    return await Db.many<ICartItem>(sql, [userId]);
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
      SET quantity = $1
      WHERE cart.id = $2`

    //update item in the cart
    const result = await Db.one<ICartItem>(sql, [quantity, id]);
    //return the user's cart
    return this.findMany(result.user_id)
  },


  async deleteItem(cartId: number) {

    const sql = `

      DELETE FROM cart
      WHERE       cart.id = $1
      RETURNING   user_id`

    const result = await Db.one<ICartItem>(sql, [cartId]);
    //return the user's cart
    return this.findMany(result.user_id);
  },


  async checkout(user_id: number) {
    //get items in user's cart
    const cart = await this.findMany(user_id);
    //get a total cost for all items in user's cart
    const total_cost = cart.reduce((total, prev) => {
      return total + prev.price;
    }, 0);
    //return the inserted row- need to attach id to order items later
    const sql = `
      INSERT INTO "order" (user_id, total_cost, placed_date, status)
      VALUES      ($1, $2, $3, $4)
      RETURNING   *`
    //intial order status is pending
    await Db.one<IOrder>(sql, [user_id, total_cost, new Date(), "PENDING"]);
    //initiate stripe
    //TODO why is ! needed here?
    const stripe = new Stripe(process.env.STRIPE_SECRET!, 
      {apiVersion: "2020-08-27", typescript: true});
    //TODO maybe type the lineItem obj
    const line_items = cart.map(item => {
      return {
        price_data: {
          currency: 'gbp',
          unit_amount: item.price * 100,
          product_data: {
            name: item.name,
            description: item.descr,         
          }

        },
        quantity: item.quantity
      }
    })
    //stripe session redirects user to pre-hosted payment page
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    console.log(session);
    //TODO handle this null
    return session.url!;
  }
}