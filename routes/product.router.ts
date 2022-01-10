import express from 'express';

import { validate } from '@middlewares/validate';
import { ProductSchema } from '@schemas/product.schema';
import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '@models/product.model';
import { verifyJWT } from '@middlewares/verify';


export const productRouter = express.Router();


productRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {

  try {
    //call method from product model
    const products = await ProductModel.findAll();
    //send the array of products back
    res.status(200).send(products);
  } 

  catch (err) {
    
    next(err);
  }
})



productRouter.get("/:id", validate(ProductSchema.get, "params"), 
async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    //call method from product model
    const product = await ProductModel.findOne(Number(req.params.id));
    //return the product
    res.status(200).send(product);
  } 
  
  catch (err) {
    
    next(err);
  }
})


productRouter.post("/", verifyJWT("admin"), validate(ProductSchema.create, "body"), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
    
    //call method from product model
    const newProduct = await ProductModel.createOne(req.body);
    //send back the new product that was created
    res.status(200).send(newProduct);
  } 

  catch (err) {
    
    next(err);
  }
})


productRouter.put("/", verifyJWT("admin"), validate(ProductSchema.update, "body"), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
  
    //call method from product model
    const updatedProduct = await ProductModel.updateOne(req.body);
    //send back the new product that was created
    res.status(200).send(updatedProduct);
  } 

  catch (err) {
    
    next(err);
  }
})


productRouter.delete("/", verifyJWT("admin"), validate(ProductSchema.delete, "body"), 
  async(req: Request, res: Response, next: NextFunction) => {

  try {
    
    //call method from product model
    const deletedProduct = await ProductModel.deleteOne(req.body.id);
    //send back the new product that was created
    res.status(200).send(deletedProduct);
  } 

  catch (err) {
    
    next(err);
  }
})
