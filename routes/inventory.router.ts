import express from 'express';
import validate from '@middlewares/validate';

import { inventorySchema, updateInventorySchema } from '@models/inventory.model';
import { deleteOne, findOne, updateOne } from '@controllers/inventory.controller';
import { Request, Response, NextFunction } from 'express';


export const inventoryRouter = express.Router();


inventoryRouter.get("/", validate(inventorySchema), async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from inventory controller
    const result = await findOne(req.body.id)
    //send the response
    res.status(200).send(result);
  } 
  
  catch (err) {
    //pass to error handling middleware
    next(err);
  }
});

inventoryRouter.put("/", validate(updateInventorySchema), async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from inventory controller
    await updateOne(req.body);
    //nothing returns from the update
    res.sendStatus(200);
  } 
  
  catch (err) {
    //pass to error handling middleware
    next(err);
  }
});

inventoryRouter.delete("/", async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from inventory controller
    await deleteOne(req.body.id);
    //nothing returns from delete statement
    res.sendStatus(200)
  }
  
  catch (err) {
    //pass to error handling middleware
    next(err)
  }
});