import express from 'express';

import { validate } from '@middlewares/validate';
import { ProductSchema } from '@schemas/product';
import { Request, Response } from 'express';
import { ProductModel } from '@models/Product';
import { toResponse } from '@utils/response';
import { InventoryModel } from '@models/Inventory';
import { asyncHandler } from '@middlewares/async';


export const productRouter = express.Router();


//create a new product
productRouter.post(
  "/", 
  validate(ProductSchema.create, "body"), 
  asyncHandler(async (req: Request, res: Response) => {

    const created = await ProductModel.createOne(req.body);
    //add entry to inventory table, defaults to 0
    await InventoryModel.createOne({ product_id: created.id, quantity: 0 })
    //status 201 = created
    res.status(201).send(toResponse(created));
  }));


//update an existing product
productRouter.put(
  "/", 
  validate(ProductSchema.update, "body"), 
  asyncHandler(async (req: Request, res: Response) => {

    const updated = await ProductModel.updateOne(req.body);

    res.status(200).send(toResponse(updated));
  }));


//delete an existng product
productRouter.delete(
  "/", 
  validate(ProductSchema.delete, "body"), 
  asyncHandler(async(req: Request, res: Response) => {

    const deleted = await ProductModel.deleteOne(req.body.id);

    res.status(200).send(toResponse(deleted));
  }));
