import { CartModel } from '@models/Cart';
import { InventoryModel } from '@models/Inventory';
import { ProductModel } from '@models/Product';
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
    //query db to check product exists
    const product = await ProductModel.findOne(input.product_id); 
    //reject if product not found
    if(!product) { return false; }
    //query db to check enough stock
    const { quantity } = await InventoryModel.findOne(input.product_id);
    //if product doesn't exist or not enough stock, schema rejects
    if(quantity < input.quantity) { return false; }
    //schema passed
    return true;
  }, {message: "product not found or is out of stock"}),

  update: cart.pick({user_id: true, id: true, quantity: true}),
  
  delete: cart.pick({user_id: true, id: true}).refine(async input => {
    
    return await CartModel.findOne(input.id);
  }, {message: "product not in cart"}),

  checkout: cart.pick({user_id: true}).refine(async input => {
    //need to check for empty cart
    const cart = await CartModel.findMany(input.user_id);
    //reject if cart empty
    if(cart.length === 0) { return false; }
    //attach cart to req body, so don't have to query cart again later
    (input as any).cart = cart;
    //schema passed
    return true;
  }, {message: "cart is empty"})
}