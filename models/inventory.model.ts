import { findOne } from '@controllers/inventory.controller';
import { number, object } from 'zod';

export interface IInventory {
  id: number,
  quantity: number
};

export const inventorySchema = object({

  id: number()

}).refine( async input => {
  return await findOne(input.id);
}, {message: "Inventory Id Does Not Exist"});


export const updateInventorySchema = object({

  id: number(),
  quantity: number()

}).refine( async input => {
  return await findOne(input.id);
}, {message: "Inventory Id Does Not Exist"});
