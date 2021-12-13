import express from 'express';
import { validateBody } from '@middlewares/validate';

import { InventorySchema } from 'schema/inventory.schema';
import { InventoryModel } from '@models/inventory.model';
import { Request, Response, NextFunction } from 'express';


export const inventoryRouter = express.Router();


inventoryRouter.get("/", validateBody(InventorySchema.get), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from inventory controller
    const result = await InventoryModel.findOne(req.body.id)
    //send the response
    res.status(200).send(result);
  } 
  
  catch (err) {
    //pass to error handling middleware
    next(err);
  }
});


inventoryRouter.put("/", validateBody(InventorySchema.update), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from inventory controller
    await InventoryModel.updateOne(req.body);
    //nothing returns from the update
    res.sendStatus(200);
  } 
  
  catch (err) {
    //pass to error handling middleware
    next(err);
  }
});


inventoryRouter.delete("/", validateBody(InventorySchema.delete), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from inventory controller
    await InventoryModel.deleteOne(req.body.id);
    //nothing returns from delete statement
    res.sendStatus(200)
  }
  
  catch (err) {
    //pass to error handling middleware
    next(err)
  }
});