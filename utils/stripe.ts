import { ICartItem } from "@interfaces/ICartItem";
import Stripe from "stripe";

//secret for verifying webhook request
const webhookSecret = "whsec_T7Fi5I8VomtWKbTrrg5HC2Ga1AjyZYUm";
//options for the stripe session
const options : Stripe.StripeConfig = {
  apiVersion: "2020-08-27", 
  typescript: true
}


export async function stripeSession(items: ICartItem[]) {
  //map array of line items from cart items
  const line_items = items.map(item => {

    const {name, descr: description, price, quantity } = item;
    //atta
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
  const stripe = new Stripe(process.env.STRIPE_SECRET!, options);
  //stripe session redirects user to pre-hosted payment page
  return await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    client_reference_id: items[0].user_id.toString()
  });
}


export function constructEvent(payload: string, sig: string) {
  //initiate stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET!, options);
  //verify signature using webhook secret, throws err on failure
  return stripe.webhooks.constructEvent(payload, sig, webhookSecret);
}