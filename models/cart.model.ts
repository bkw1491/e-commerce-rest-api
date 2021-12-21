import Stripe from 'stripe';
import query from "@config/database";
import { ICartItem } from "@interfaces/ICartItem";

export const CartModel = {


  async getItems(item: Pick<ICartItem, "user_id">) : Promise<ICartItem[]> {

    //perform an inner join to return all the product in the cart
    const sql = `SELECT c.id, p.name, p.descr, p.price, c.quantity
                FROM cart c JOIN product p
                ON c.product_id = p.id
                WHERE c.user_id = $1;`
    
    return await query<ICartItem>(sql, [item.user_id]);
  },


  async addItem(item: Omit<ICartItem, "id">) : Promise<ICartItem[]> {
    //query an sql func which adds row to cart table
    //updates the product's inventory
    //then returns a table from an inner join with product
    const sql = `SELECT * 
                FROM addToCart($1, $2, $3)`;

    return await query<ICartItem>(sql, [item.user_id, 
      item.product_id, item.quantity]);
  },


  async updateItem(item: ICartItem) : Promise<ICartItem[]> {
    //query an sql func which updates row in cart table
    //updated the product's inventory
    //then returns a table from an inner join with product
    const sql = `SELECT *
                FROM updateCart($1, $2)`

    return await query<ICartItem>(sql, [item.id, item.quantity]);
  },


  async deleteItem(item: Pick<ICartItem, "id">) : Promise<ICartItem[]> {
    //query an sql func which updates row in cart table
    //updated the product's inventory
    //then returns a table from an inner join with product
    const sql = `SELECT *
                FROM removeFromCart($1);`

    return await query<ICartItem>(sql, [item.id]);
  },


  async checkout(user_id: number) : Promise<string | null> {

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