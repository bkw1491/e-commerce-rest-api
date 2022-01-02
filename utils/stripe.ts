import { ICartItem } from "@interfaces/ICartItem";
import Stripe from "stripe";

//options for the stripe session
const options : Stripe.StripeConfig = {
  apiVersion: "2020-08-27", 
  typescript: true
}

export async function stripeSession(items: ICartItem[]) {
  //map array of line items from cart items
  const line_items = items.map(item => {

    const {name, descr: description, price, quantity } = item;

    return {
      quantity,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(price * 10000) / 100,
        product_data: { name, description }
      }
    }
  });
  //initiate stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET, options)
  //stripe session redirects user to pre-hosted payment page
  return await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });
}