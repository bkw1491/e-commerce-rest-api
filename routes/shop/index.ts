import express from 'express';

import { Request, Response } from 'express';
import { validate } from '@middlewares/validate';
import { ProductSchema } from '@schemas/product';
import { ProductModel } from '@models/Product';
import { toResponse } from '@utils/response';
import { asyncHandler } from '@middlewares/async';
import { CategoryModel } from '@models/Category';
import { IProduct } from '@interfaces/IProduct';


export const shopRouter = express.Router();


//get all products or search filtered
shopRouter.get(
  "/",
  validate(ProductSchema.get, "query"),
  asyncHandler(async (req: Request, res: Response) => {
   
    const products = 
    req.query.name ? await ProductModel.findByName(String(req.query.name)) :
    req.query.id ? await ProductModel.findOne(Number(req.query.id)) :
    await ProductModel.findAll();
    
    res.status(200).send(toResponse(products));
  }));


//get list of all categories
shopRouter.get(
  "/categories",
  asyncHandler(async (req: Request, res: Response) => {
   
    const categories = await CategoryModel.findAll();
    
    res.status(200).send(toResponse(categories));
  }));


//get products by department
shopRouter.get(
  "/:department",
  asyncHandler(async (req: Request, res: Response) => {

    const byDepartment = await ProductModel.findByDepartment(
      req.params.department);

    res.status(200).send(toResponse(byDepartment));
  }));

  
//get products by department and category
shopRouter.get(
  "/:department/:category",
  asyncHandler(async (req: Request, res: Response) => {

    const byCategory = await ProductModel.findByCategory(
      req.params.department, req.params.category);
    
    res.status(200).send(toResponse(byCategory));
  }));