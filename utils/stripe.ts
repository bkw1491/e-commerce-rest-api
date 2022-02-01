import Stripe from "stripe";

import { ICartItem } from "@interfaces/ICartItem";

//options for the stripe session
const options : Stripe.StripeConfig = {
  apiVersion: "2020-08-27", 
  typescript: true,
}
//initiate stripe
const stripe = new Stripe(process.env.STRIPE_SECRET!, options);


export async function stripeSession(items: ICartItem[]) {
  //map array of line items from cart items
  const line_items = items.map(item => {

    const {name, descr: description, price, quantity, image_url } = item;
    //atta
    return {
      quantity,
      price_data: {
        currency: 'gbp',
        unit_amount: price,
        product_data: { name, description, images:[image_url] }
      }
    }
  });
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
  //verify signature using webhook secret, throws err on failure
  return stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
}