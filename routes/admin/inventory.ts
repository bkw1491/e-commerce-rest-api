import express from 'express';

import { Request, Response } from 'express';
import { validate } from '@middlewares/validate';
import { toResponse } from '@utils/response';
import { InventoryModel } from '@models/Inventory';
import { InventorySchema } from '@schemas/inventory';
import { asyncHandler } from '@middlewares/async';


export const inventoryRouter = express.Router();


//find the inventory for a product
inventoryRouter.get(
  "/", 
  validate(InventorySchema.get, "body"),
  asyncHandler(async (req: Request, res: Response) => {
    
    const inventory = await InventoryModel.findOne(req.body.product_id);

    res.status(200).send(toResponse(inventory));
  }));


//update an inventory for a product
inventoryRouter.put(
  "/", 
  validate(InventorySchema.update, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const updatedInventory = await InventoryModel.updateOne(req.body);

    res.status(200).send(toResponse(updatedInventory));
  }));