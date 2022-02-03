import express from 'express';

import { Request, Response } from 'express';
import { validate } from '@middlewares/validate';
import { CategoryModel } from '@models/Category';
import { CategorySchema } from '@schemas/category';
import { toResponse } from '@utils/response';
import { asyncHandler } from '@middlewares/async';


export const categoryRouter = express.Router();


//creating new categories
categoryRouter.post(
  "/",
  validate(CategorySchema.create, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const created = await CategoryModel.createOne(req.body);
    //201 status = created
    res.status(201).send(toResponse(created));
  }));


//update an existing category
categoryRouter.put(
  "/", 
  validate(CategorySchema.update, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const updated = await CategoryModel.updateOne(req.body);

    res.status(200).send(toResponse(updated));
  }));


//deleting existing categories
categoryRouter.delete(
  "/", 
  validate(CategorySchema.delete, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const deleted = await CategoryModel.deleteOne(req.body.id);

    res.status(200).send(toResponse(deleted));
  }));