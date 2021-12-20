import express from 'express';
import { validateBody, validateParams } from '@middlewares/validate';

import { Request, Response, NextFunction } from 'express';
import { CategoryModel } from '@models/category.model';
import { CategorySchema } from '@schemas/category.schema';


export const categoryRouter = express.Router();


categoryRouter.get("/:id", validateParams(CategorySchema.get),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from product model
    const products = 
      await CategoryModel.findProducts(Number(req.params.id));
    //send the array of products back
    res.status(200).send(products);
  } 

  catch (err) {
    
    next(err);
  }
})


categoryRouter.post("/", validateBody(CategorySchema.create),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from product controller
    const newCategory = await CategoryModel.createOne(req.body.name);
    //send the created category back
    res.status(201).send(newCategory);
  } 
  
  catch (err) {
    
    next(err);
  }
})


categoryRouter.put("/", validateBody(CategorySchema.update),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from category model
    const updatedCategory = await CategoryModel.updateOne(req.body);
    //send updated category back
    res.status(200).send(updatedCategory);
    
  } 
  
  catch (err) {
    
    next(err);
  }
})


categoryRouter.delete("/", validateBody(CategorySchema.delete),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from category model
    const deletedCategory = await CategoryModel.deleteOne(req.body.id);
    //send updated category back
    res.status(200).send(deletedCategory);
  } 
  
  catch (err) {
    
    next(err);
  }
})