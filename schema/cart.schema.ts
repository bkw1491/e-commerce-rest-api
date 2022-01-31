import { CartModel } from '@models/cart.model';
import { InventoryModel } from '@models/inventory.model';
import { ProductModel } from '@models/product.model';
import { object, number } from 'zod';


const cart = object({
  id: number(),
  user_id: number(),
  product_id: number(),
  quantity: number().min(1).max(100)
})


export const CartSchema = {

  get: cart.pick({user_id: true}),

  create: cart.omit({id: true}).refine(async input => {
    //need to query db to check product exists/check enough stock
    const [product, { quantity }] = await Promise.all([
      ProductModel.findOne(input.product_id), 
      InventoryModel.findOne(input.product_id)
    ]);
    //if product doesn't exist or not enough stock, schema rejects
    if(!product || quantity < input.quantity) { return false; }
    //schema passed
    return true;
  }, {message: "product not found or is out of stock"}),

  update: cart.pick({user_id: true, id: true, quantity: true}),
  delete: cart.pick({user_id: true, id: true}).refine(async input => {
    
    return await CartModel.findOne(input.id);
  }, {message: "product not in cart"})
}