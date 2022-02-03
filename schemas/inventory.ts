import { ProductModel } from '@models/Product';
import { object, number } from 'zod';

//if product in product table, will always be in inventory table
const inventory = object({
  id: number(),
  product_id: number().refine(async pid => 
    await ProductModel.findOne(pid),
    { message: "product id does not exist" }),
  quantity: number().min(1).max(999),
})


export const InventorySchema = {

  get: inventory.pick({ product_id: true }),
  update: inventory.omit({ id: true })
}