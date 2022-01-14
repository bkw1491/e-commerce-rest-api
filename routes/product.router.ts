import express from 'express';

import { validate } from '@middlewares/validate';
import { ProductSchema } from '@schemas/product.schema';
import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '@models/product.model';
import { verifyJWT } from '@middlewares/verify';
import { toResponse } from '@utils/response';


export const productRouter = express.Router();


productRouter.get("/all", async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from product model
    const products = await ProductModel.findAll();
    //send the array of products back
    res.status(200).send(toResponse(products));
  } 

  catch (err) {
    
    next(err);
  }
})



productRouter.get("/", validate(ProductSchema.get), 
async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    //call method from product model
    const product = await ProductModel.findOne(req.body.id);
    //return the product
    res.status(200).send(toResponse(product));
  } 
  
  catch (err) {
    
    next(err);
  }
})


productRouter.post("/", verifyJWT("admin"), validate(ProductSchema.create), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    
    //call method from product model
    const newProduct = await ProductModel.createOne(req.body);
    //send back the new product that was created
    res.status(200).send(toResponse(newProduct));
  } 

  catch (err) {
    
    next(err);
  }
})


productRouter.put("/", verifyJWT("admin"), validate(ProductSchema.update), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
  
    //call method from product model
    const updatedProduct = await ProductModel.updateOne(req.body);
    //send back the new product that was created
    res.status(200).send(toResponse(updatedProduct));
  } 

  catch (err) {
    
    next(err);
  }
})


productRouter.delete("/", verifyJWT("admin"), validate(ProductSchema.delete), 
  async(req: Request, res: Response, next: NextFunction) => {

  try {
    
    //call method from product model
    const deletedProduct = await ProductModel.deleteOne(req.body.id);
    //send back the new product that was created
    res.status(200).send(toResponse(deletedProduct));
  } 

  catch (err) {
    
    next(err);
  }
})
