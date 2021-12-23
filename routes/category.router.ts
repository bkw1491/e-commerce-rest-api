import express from 'express';
import { validateBody, validateParams } from '@middlewares/validate';

import { Request, Response, NextFunction } from 'express';
import { CategoryModel } from '@models/category.model';
import { CategorySchema } from '@schemas/category.schema';
import { verifyJWT } from '@middlewares/verify';


export const categoryRouter = express.Router();


categoryRouter.get("/:id", validateParams(CategorySchema.get),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //returns an array of products filtered by category
    const products = await CategoryModel.findMany(Number(req.params.id));

    res.status(200).send(products);
  } 

  catch (err) {
    
    next(err);
  }
})


categoryRouter.post("/", verifyJWT("admin"), validateBody(CategorySchema.create),
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


categoryRouter.put("/", verifyJWT("admin"), validateBody(CategorySchema.update),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const updatedCategory = await CategoryModel.updateOne(req.body);

    res.status(200).send(updatedCategory);
  } 
  
  catch (err) {
    
    next(err);
  }
})


categoryRouter.delete("/", verifyJWT("admin"), validateBody(CategorySchema.delete),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const deletedCategory = await CategoryModel.deleteOne(req.body.id);

    res.status(200).send(deletedCategory);
  } 
  
  catch (err) {
    
    next(err);
  }
})