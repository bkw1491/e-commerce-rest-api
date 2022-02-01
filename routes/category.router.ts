import express from 'express';

import { Request, Response, NextFunction } from 'express';
import { validate } from '@middlewares/validate';
import { CategoryModel } from '@models/category.model';
import { CategorySchema } from '@schemas/category.schema';
import { verifyJWT } from '@middlewares/verify';
import { toResponse } from '@utils/response';
import { ProductModel } from '@models/product.model';


export const categoryRouter = express.Router();


categoryRouter.get("/",
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //returns an array of all categories
    const categories = await CategoryModel.findAll();

    res.status(200).send(toResponse(categories));
  } 

  catch (err) {
    
    next(err);
  }
})


categoryRouter.get("/:name", validate(CategorySchema.get, "params"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    //returns an array of products filtered by category
    const products = await ProductModel.findByCategory(req.params.name);

    res.status(200).send(toResponse(products));
  } 

  catch (err) {
    
    next(err);
  }
})


categoryRouter.post("/", verifyJWT("admin"), validate(CategorySchema.create, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const newCategory = await CategoryModel.createOne(req.body);

    res.status(201).send(toResponse(newCategory));
  } 
  
  catch (err) {
    
    next(err);
  }
})


categoryRouter.put("/", verifyJWT("admin"), validate(CategorySchema.update, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const updatedCategory = await CategoryModel.updateOne(req.body);

    res.status(200).send(toResponse(updatedCategory));
  } 
  
  catch (err) {
    
    next(err);
  }
})


categoryRouter.delete("/", verifyJWT("admin"), validate(CategorySchema.delete, "body"),
  async (req: Request, res: Response, next: NextFunction) => {

  try {

    const deletedCategory = await CategoryModel.deleteOne(req.body.id);

    res.status(200).send(toResponse(deletedCategory));
  } 
  
  catch (err) {
    
    next(err);
  }
})