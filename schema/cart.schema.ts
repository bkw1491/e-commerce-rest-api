import { ProductModel } from '@models/product.model';
import {object, number } from 'zod';



const cart = object({
  id: number(),
  user_id: number(),
  product_id: number(),
  quantity: number().max(100)
})

export const CartSchema = {

  get: cart.pick({user_id: true}),

  create: cart.omit({id: true}).refine(async input => {
    //schema rejects if product doesn't exist
    const product = await ProductModel.findOne(input.product_id);
    //if product doesn't exist or not enough stock, schema rejects
    if(!product || product.inventory < input.quantity) { return false }
    //schema passed
    return true
  }, {message: "product not found or is out of stock"}),

  update: cart.pick({id: true, quantity: true}),
  delete: cart.pick({id: true})
}