import { InventoryModel } from '@models/inventory.model';
import { number, object } from 'zod';

export interface IInventory {
  id: number,
  quantity: number
};

const product = object({

  id: 
    number().
    refine(async id => await InventoryModel.findOne(id), 
      {message: "inventory does not exist"}),
  quantity: 
    number()
})

export const InventorySchema = {

  get: product.pick({id: true}),
  create: product.pick({quantity: true}),
  update: product.pick({id: true, quantity: true}),
  delete: product.pick({id: true})
}
