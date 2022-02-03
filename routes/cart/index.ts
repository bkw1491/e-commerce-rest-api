import express from 'express';

import { Request, Response } from 'express';
import { validate } from '@middlewares/validate';
import { CartSchema } from '@schemas/cart';
import { CartModel } from '@models/Cart';
import { verifyJWT } from '@middlewares/verify';
import { toResponse } from '@utils/response';
import { asyncHandler } from '@middlewares/async';


export const cartRouter = express.Router();


//all routes here will require user priv
cartRouter.use(verifyJWT("user"));


//retrieving a user's cart
cartRouter.get(
  "/", 
  validate(CartSchema.get, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const cart = await CartModel.findMany(req.body.user_id);

    res.status(200).send(toResponse(cart))
  }));


//checkout and pay
cartRouter.post(
  "/checkout", 
  validate(CartSchema.checkout, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const paymentUrl = await CartModel.checkout(req.body.cart);
    //303 = redirected, redirects to stripe hosted checkout
    res.redirect(303, paymentUrl);
  }));


//add items to a cart
cartRouter.post(
  "/", 
  validate(CartSchema.create, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const cart = await CartModel.createOne(req.body);
    //201 = created
    res.status(201).send(toResponse(cart));
  }));


//update an item in a cart
cartRouter.put(
  "/",  
  validate(CartSchema.update, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const cart = await CartModel.updateOne(req.body);

    res.status(200).send(toResponse(cart));    
  }));


//remove items from a cart
cartRouter.delete(
  "/",  
  validate(CartSchema.delete, "body"),
  asyncHandler(async (req: Request, res: Response) => {

    const cart = await CartModel.deleteOne(req.body.id);

    res.status(200).send(toResponse(cart));    
  }));
