import express from 'express';

import { validate } from '@middlewares/validate';
import { ProductSchema } from '@schemas/product.schema';
import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '@models/product.model';
import { verifyJWT } from '@middlewares/verify';
import { toResponse } from '@utils/response';
import { InventoryModel } from '@models/inventory.model';


export const productRouter = express.Router();


productRouter.get("/", validate(ProductSchema.getAll, "query"),
 async (req: Request, res: Response, next: NextFunction) => {

  try {
    //return filtered products if a query string provided
    //otherwise send back all products
    const products = req.query.name 
      ? await ProductModel.findByName(String(req.query.name))
      : await ProductModel.findAll();

    res.status(200).send(toResponse(products));
  } 

  catch (err) {
    
    next(err);
  }
})


productRouter.get("/:id", validate(ProductSchema.getOne, "params"), 
async (req: Request, res: Response, next: NextFunction) => {
  
  try {

    const product = await ProductModel.findOne(Number(req.params.id));

    res.status(200).send(toResponse(product));
  } 
  
  catch (err) {
    
    next(err);
  }
})


productRouter.post("/", verifyJWT("admin"), validate(ProductSchema.create, "body"), 
  async (req: Request, res: Response, next: NextFunction) => {

  try { 
    //TODO add an option to specify inventory when creating new product
    const newProduct = await ProductModel.createOne(req.body);
    //add entry to inventory table, defaults to one, see todo above
    await InventoryModel.createOne({ product_id: newProduct.id, quantity: 1 })

    res.status(200).send(toResponse(newProduct));
  } 

  catch (err) {
    
    next(err);
  }
})


productRouter.put("/", verifyJWT("admin"), validate(ProductSchema.update, "body"), 
  async (req: Request, res: Response, next: NextFunction) => {

  try {
  
    const updatedProduct = await ProductModel.updateOne(req.body);

    res.status(200).send(toResponse(updatedProduct));
  } 

  catch (err) {
    
    next(err);
  }
})


productRouter.delete("/", verifyJWT("admin"), validate(ProductSchema.delete, "body"), 
  async(req: Request, res: Response, next: NextFunction) => {

  try {
    
    const deletedProduct = await ProductModel.deleteOne(req.body.id);

    res.status(200).send(toResponse(deletedProduct));
  } 

  catch (err) {
    
    next(err);
  }
})
