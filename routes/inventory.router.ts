import express from 'express';

import { Request, Response, NextFunction } from 'express';
import { validate } from '@middlewares/validate';
import { verifyJWT } from '@middlewares/verify';
import { toResponse } from '@utils/response';
import { InventoryModel } from '@models/inventory.model';
import { InventorySchema } from '@schemas/inventory.schema';


export const inventoryRouter = express.Router();


inventoryRouter.get("/", verifyJWT("admin"), validate(InventorySchema.get, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //returns inventory for specific product
    const inventory = await InventoryModel.findOne(req.body.product_id);

    res.status(200).send(toResponse(inventory));
  } 

  catch (err) {
    
    next(err);
  }
})


inventoryRouter.post("/", verifyJWT("admin"), validate(InventorySchema.create, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const newInventory = await InventoryModel.createOne(req.body);
    //send the created inventory back
    res.status(201).send(toResponse(newInventory));
  } 
  
  catch (err) {
    
    next(err);
  }
})


inventoryRouter.put("/", verifyJWT("admin"), validate(InventorySchema.update, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const updatedInventory = await InventoryModel.updateOne(req.body);

    res.status(200).send(toResponse(updatedInventory));
  } 
  
  catch (err) {
    
    next(err);
  }
})